import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Check, X, AlertCircle } from "lucide-react";
import { DriverRegistration } from "@/types/driver";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const DriverVerificationPanel = () => {
  const [selectedRegistration, setSelectedRegistration] = useState<DriverRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusComment, setStatusComment] = useState("");
  const [documentUrls, setDocumentUrls] = useState<{[key: string]: string}>({});

  const { data: registrations, isLoading, error, refetch } = useQuery({
    queryKey: ['driver-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_registrations')
        .select('*')
        .order('registrationDate', { ascending: false });

      if (error) throw error;
      return data as DriverRegistration[];
    },
  });

  const updateRegistrationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsUpdating(true);

      const { error } = await supabase
        .from('driver_registrations')
        .update({ 
          status, 
          statusComment,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // If approved, create worker profile
      if (status === 'approved' && selectedRegistration) {
        const { error: workerError } = await supabase
          .from('worker_profiles')
          .insert({
            name: selectedRegistration.fullName,
            phone: selectedRegistration.phoneNumber,
            type: 'driver',
            commission_rate: 0.15, // Default commission rate
            vehicleType: selectedRegistration.vehicleType,
            vehicleSize: selectedRegistration.vehicleSize,
            plateNumber: selectedRegistration.plateNumber,
            workingLocation: selectedRegistration.workingLocation,
            isActive: true,
          });

        if (workerError) throw workerError;

        // Send approval SMS
        const approvalMessage = `Congratulations ${selectedRegistration.fullName}! Your driver registration has been approved. Welcome to Kwimuka! Please download our driver app to start receiving orders.`;
        await supabase.functions.invoke('send-order-sms', {
          body: {
            phoneNumber: selectedRegistration.phoneNumber,
            message: approvalMessage
          }
        });
      }

      // Send rejection SMS if rejected
      if (status === 'rejected' && selectedRegistration) {
        const rejectionMessage = `Dear ${selectedRegistration.fullName}, your driver registration could not be approved at this time.${
          statusComment ? ` Reason: ${statusComment}` : ''
        } Please contact support for more information.`;
        await supabase.functions.invoke('send-order-sms', {
          body: {
            phoneNumber: selectedRegistration.phoneNumber,
            message: rejectionMessage
          }
        });
      }

      toast({
        title: `Registration ${status}`,
        description: `Driver registration has been ${status}`,
      });

      setSelectedRegistration(null);
      setStatusComment("");
      refetch();

    } catch (error) {
      console.error('Error updating registration:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the registration",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get public URLs for documents
  const getPublicUrls = async (registration: DriverRegistration) => {
    const urls: {[key: string]: string} = {};
    const documents = [
      { key: 'profilePhotoUrl', path: registration.profilePhotoUrl },
      { key: 'vehiclePhotoUrl', path: registration.vehiclePhotoUrl },
      { key: 'platePhotoUrl', path: registration.platePhotoUrl },
      { key: 'licenceFrontUrl', path: registration.licenceFrontUrl },
      { key: 'licenceBackUrl', path: registration.licenceBackUrl }
    ];

    if (registration.insuranceDocUrl) {
      documents.push({ key: 'insuranceDocUrl', path: registration.insuranceDocUrl });
    }

    for (const doc of documents) {
      const { data } = await supabase.storage
        .from('driver-documents')
        .getPublicUrl(doc.path);
      if (data?.publicUrl) {
        urls[doc.key] = data.publicUrl;
      }
    }

    setDocumentUrls(urls);
  };

  useEffect(() => {
    if (selectedRegistration) {
      getPublicUrls(selectedRegistration);
    }
  }, [selectedRegistration]);

  if (isLoading) return <div>Loading registrations...</div>;
  if (error) return <div>Error loading registrations</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Driver Registrations</h2>
        {/* Add any filters or search here if needed */}
      </div>

      <div className="divide-y divide-gray-200">
        {registrations?.map((registration) => (
          <div key={registration.id} className="py-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium">{registration.fullName}</h3>
                <p className="text-sm text-gray-500">{registration.phoneNumber}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(registration.status)}`}>
                    {registration.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Registered on: {new Date(registration.registrationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedRegistration(registration)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                {selectedRegistration && (
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Driver Registration Details</DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Basic Information</h4>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-gray-500">Full Name</dt>
                            <dd>{selectedRegistration.fullName}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">National ID</dt>
                            <dd>{selectedRegistration.nationalId}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Phone Number</dt>
                            <dd>{selectedRegistration.phoneNumber}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Vehicle Information</h4>
                        <dl className="space-y-2 text-sm">
                          <div>
                            <dt className="text-gray-500">Vehicle Type</dt>
                            <dd className="capitalize">{selectedRegistration.vehicleType}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Vehicle Size</dt>
                            <dd className="capitalize">{selectedRegistration.vehicleSize}</dd>
                          </div>
                          <div>
                            <dt className="text-gray-500">Plate Number</dt>
                            <dd>{selectedRegistration.plateNumber}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="col-span-2">
                        <h4 className="font-medium mb-2">Working Location</h4>
                        <p className="text-sm">
                          {selectedRegistration.workingLocation.sector}, {selectedRegistration.workingLocation.district}, {selectedRegistration.workingLocation.province}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <h4 className="font-medium mb-2">Documents</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <a
                            href={documentUrls.profilePhotoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Profile Photo
                          </a>
                          <a
                            href={documentUrls.vehiclePhotoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Vehicle Photo
                          </a>
                          <a
                            href={documentUrls.platePhotoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Plate Photo
                          </a>
                          <a
                            href={documentUrls.licenceFrontUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            License (Front)
                          </a>
                          <a
                            href={documentUrls.licenceBackUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            License (Back)
                          </a>
                          {selectedRegistration.insuranceDocUrl && (
                            <a
                              href={documentUrls.insuranceDocUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-600 hover:underline"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Insurance
                            </a>
                          )}
                        </div>
                      </div>

                      {selectedRegistration.status === 'pending' && (
                        <div className="col-span-2 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Status Comment</label>
                            <Textarea
                              placeholder="Add a comment about your decision..."
                              value={statusComment}
                              onChange={(e) => setStatusComment(e.target.value)}
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <Button
                              variant="destructive"
                              disabled={isUpdating}
                              onClick={() => updateRegistrationStatus(selectedRegistration.id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="default"
                              disabled={isUpdating}
                              onClick={() => updateRegistrationStatus(selectedRegistration.id, 'approved')}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedRegistration.statusComment && (
                        <div className="col-span-2">
                          <div className="rounded-lg bg-gray-50 p-3">
                            <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Status Comment
                            </div>
                            <p className="text-sm text-gray-600">{selectedRegistration.statusComment}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverVerificationPanel;
