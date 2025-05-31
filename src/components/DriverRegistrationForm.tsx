import { useState } from "react";
import { Camera, Truck, MapPin, Upload, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useRwandaLocations from "@/hooks/useRwandaLocations";
import { VEHICLE_SIZES, VEHICLE_TYPES } from "@/types/driver";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  nationalId: z.string().length(16, "National ID must be 16 characters"),
  phoneNumber: z.string().regex(/^(\+?250|0)?7[2389][0-9]{7}$/, "Invalid Rwandan phone number"),
  vehicleType: z.enum(VEHICLE_TYPES),
  vehicleSize: z.enum(VEHICLE_SIZES),
  plateNumber: z.string().regex(/^[A-Z]{2,3}\d{3}[A-Z]$/, "Invalid plate number format"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  sector: z.string().min(1, "Sector is required"),
});

const DriverRegistrationForm = () => {
  const { hierarchy } = useRwandaLocations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState({
    profilePhoto: null,
    vehiclePhoto: null,
    platePhoto: null,
    licenceFront: null,
    licenceBack: null,
    insurance: null,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      nationalId: "",
      phoneNumber: "",
      vehicleType: "car",
      vehicleSize: "medium",
      plateNumber: "",
      province: "",
      district: "",
      sector: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const uploadFile = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${path}/${uuidv4()}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage
      .from('driver-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Error uploading ${path}: ${uploadError.message}`);
    }

    return data.path;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Validate required files
      const requiredFiles = ['profilePhoto', 'vehiclePhoto', 'platePhoto', 'licenceFront', 'licenceBack'];
      for (const fileKey of requiredFiles) {
        if (!files[fileKey]) {
          toast({
            title: "Missing required file",
            description: `Please upload ${fileKey.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
            variant: "destructive",
          });
          return;
        }
      }

      // Upload all files
      const uploadedFiles = {} as Record<string, string>;
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          uploadedFiles[`${key}Url`] = await uploadFile(file, key);
        }
      }

      // Create driver registration record
      const { error: insertError } = await supabase
        .from('driver_registrations')
        .insert({
          id: uuidv4(),
          ...values,
          ...uploadedFiles,
          workingLocation: {
            province: values.province,
            district: values.district,
            sector: values.sector,
          },
          registrationDate: new Date().toISOString(),
          status: 'pending'
        });

      if (insertError) throw insertError;

      // Send confirmation SMS
      const smsMessage = `Hello ${values.fullName}!\nYour registration as a driver has been received.\nPhone: ${values.phoneNumber}\nLocation: ${values.sector}, ${values.district}\nWe'll review and contact you shortly.\nThank you for joining Kwimuka!`;
      
      const { error: smsError } = await supabase.functions.invoke('send-order-sms', {
        body: {
          phoneNumber: values.phoneNumber,
          message: smsMessage
        }
      });

      toast({
        title: "Registration Successful",
        description: smsError 
          ? "Registration complete but SMS failed to send" 
          : "Driver registration received. Confirmation SMS sent.",
      });

      form.reset();
      setFiles({
        profilePhoto: null,
        vehiclePhoto: null,
        platePhoto: null,
        licenceFront: null,
        licenceBack: null,
        insurance: null,
      });

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "There was an error submitting your registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Photo Upload */}
          <div className="col-span-full">
            <FormLabel>Profile Photo</FormLabel>
            <div className="mt-2 flex items-center gap-x-3">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                {files.profilePhoto ? (
                  <img
                    src={URL.createObjectURL(files.profilePhoto)}
                    alt="Profile preview"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <Camera className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
              >
                <label>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'profilePhoto')}
                  />
                  Change photo
                </label>
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>National ID Number</FormLabel>
                <FormControl>
                  <Input placeholder="1234567890123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+250 78X XXX XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Plate Number</FormLabel>
                <FormControl>
                  <Input placeholder="RAD123B" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VEHICLE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VEHICLE_SIZES.map(size => (
                      <SelectItem key={size} value={size}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location Fields */}
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hierarchy.provinces.map(province => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!form.watch('province')}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(hierarchy.districts[form.watch('province')] || []).map(district => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sector</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!form.watch('district')}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(hierarchy.sectors[form.watch('district')] || []).map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Document Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel>Vehicle Photo</FormLabel>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <label className="flex items-center justify-center gap-2">
                  <Truck className="h-4 w-4" />
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'vehiclePhoto')}
                  />
                  {files.vehiclePhoto ? 'Change vehicle photo' : 'Upload vehicle photo'}
                </label>
              </Button>
              {files.vehiclePhoto && (
                <p className="mt-1 text-sm text-green-600">✓ Vehicle photo uploaded</p>
              )}
            </div>
          </div>

          <div>
            <FormLabel>Plate Number Photo</FormLabel>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <label className="flex items-center justify-center gap-2">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'platePhoto')}
                  />
                  {files.platePhoto ? 'Change plate photo' : 'Upload plate photo'}
                </label>
              </Button>
              {files.platePhoto && (
                <p className="mt-1 text-sm text-green-600">✓ Plate photo uploaded</p>
              )}
            </div>
          </div>

          <div>
            <FormLabel>Driving License (Front)</FormLabel>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <label className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'licenceFront')}
                  />
                  {files.licenceFront ? 'Change license front' : 'Upload license front'}
                </label>
              </Button>
              {files.licenceFront && (
                <p className="mt-1 text-sm text-green-600">✓ License front uploaded</p>
              )}
            </div>
          </div>

          <div>
            <FormLabel>Driving License (Back)</FormLabel>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <label className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'licenceBack')}
                  />
                  {files.licenceBack ? 'Change license back' : 'Upload license back'}
                </label>
              </Button>
              {files.licenceBack && (
                <p className="mt-1 text-sm text-green-600">✓ License back uploaded</p>
              )}
            </div>
          </div>

          <div>
            <FormLabel>Insurance Document (Optional)</FormLabel>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                asChild
              >
                <label className="flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={e => handleFileChange(e, 'insurance')}
                  />
                  {files.insurance ? 'Change insurance doc' : 'Upload insurance doc'}
                </label>
              </Button>
              {files.insurance && (
                <p className="mt-1 text-sm text-green-600">✓ Insurance document uploaded</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit for Verification'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default DriverRegistrationForm;
