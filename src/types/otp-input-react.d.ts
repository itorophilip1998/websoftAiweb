declare module 'otp-input-react' {
  interface OTPInputProps {
    value: string;
    onChange: (value: string) => void;
    autoFocus?: boolean;
    OTPLength: number;
    otpType: 'number' | 'string';
    disabled?: boolean;
    secure?: boolean;
  }
  
  const OTPInput: React.FC<OTPInputProps>;
  export default OTPInput;
}
