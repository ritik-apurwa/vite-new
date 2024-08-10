import React from "react";
import { Control } from "react-hook-form";
import { IconType } from "react-icons";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Checkbox } from "../checkbox";
import { Label } from "../label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../select";

export enum FormType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  SELECT = "select",
  NUMBER_INPUT = "numberInput",
  SKELETON = "skeleton",
  IMAGEUPLOAD = "imageUpload",
  PHONE_INPUT = "phoneInput",
}

interface FormProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  icon?: IconType;
  disabled?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  formType: FormType;
}

const RenderInput = ({ field, props }: { field: any; props: FormProps }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(parseFloat(e.target.value));
  };

  const Icon: IconType | undefined = props.icon;

  switch (props.formType) {
    case FormType.PHONE_INPUT:
      const phoneValue =
        typeof field.value === "string" ? field.value : undefined;
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="IN"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={phoneValue}
            onChange={(value) => field.onChange(value || undefined)}
            className="border h-10 px-3 rounded-md shadow-sm gap-x-2"
          />
        </FormControl>
      );

    case FormType.NUMBER_INPUT:
      return (
        <FormControl>
          <Input
            type="number"
            {...field}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </FormControl>
      );

    case FormType.INPUT:
      return (
        <FormControl>
          <div className="relative flex items-center">
            {Icon && (
              <div className="absolute left-3">
                <Icon className="text-gray-400" />
              </div>
            )}
            <Input
              placeholder={props.placeholder}
              {...field}
              className={`w-full p-2 border rounded-md ${Icon ? "pl-10" : ""}`}
            />
          </div>
        </FormControl>
      );

    case FormType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="w-full p-2 border rounded-md"
          />
        </FormControl>
      );

    case FormType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label
              htmlFor={props.name}
              className="text-sm font-medium text-gray-700"
            >
              {props.label}
            </Label>
          </div>
        </FormControl>
      );

    case FormType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>{props.children}</SelectContent>
          </Select>
        </FormControl>
      );

    case FormType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;

    default:
      return null;
  }
};

const CustomForm = (props: FormProps) => {
  const { control, name, label, formType } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {formType !== FormType.CHECKBOX && label && (
            <FormLabel className="text-sm font-medium text-gray-700 mb-1">
              {label}
            </FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="text-sm text-red-500 mt-1" />
        </FormItem>
      )}
    />
  );
};

export default CustomForm;
