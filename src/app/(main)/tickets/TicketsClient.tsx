"use client";

import { useState, useEffect, useRef, type MutableRefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Ticket, 
  User as UserIcon, 
  School, 
  Key, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  Fingerprint,
  QrCode,
  CheckCircle,
  Upload,
  ImagePlus,
  Download,
  MessageCircle,
  ScanLine
} from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { useUser } from "@stackframe/stack";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getUser, updateUserDetails, createTicket, hasTicket, verifyTicketUnlockPassword } from "@/app/actions/user";
import { SITE_CONFIG } from "@/config/site";

const steps = [
  { id: "identity", title: "IDENTITY MINTING", icon: UserIcon, subtitle: "STEP 01 // PERSONAL SIGIL" },
  { id: "contact", title: "CONTACT SIGIL", icon: Phone, subtitle: "STEP 02 // COMMUNICATION WAVE" },
  { id: "lineage", title: "PROOF OF LINEAGE", icon: School, subtitle: "STEP 03 // ACADEMIC BONDS" },
  { id: "sigil", title: "DIGITAL SIGIL", icon: Ticket, subtitle: "STEP 04 // VISUAL MARK" },
  { id: "security", title: "SECURITY OVERRIDE", icon: Key, subtitle: "STEP 05 // RECOVERY SEAL" },
  { id: "finalize", title: "FINAL SEALING", icon: ShieldCheck, subtitle: "STEP 06 // PASS GENERATION" },
];

export default function TicketsClient() {
  const user = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasUserTicket, setHasUserTicket] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    phoneNumber: "",
    rollNo: "",
    idCardImageUrl: "",
    password: "",
  });
  const [dbUser, setDbUser] = useState<any>(null);
  const [showPass, setShowPass] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [unlockingPass, setUnlockingPass] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isPassUnlocked, setIsPassUnlocked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passExportRef = useRef<HTMLDivElement>(null);
  const visibleQrRef = useRef<HTMLDivElement>(null);
  const exportQrRef = useRef<HTMLDivElement>(null);
  const visibleQrInstanceRef = useRef<any>(null);
  const exportQrInstanceRef = useRef<any>(null);

  type FormField = keyof typeof form;

  const [errors, setErrors] = useState<Record<FormField, string>>({
    displayName: "",
    phoneNumber: "",
    rollNo: "",
    idCardImageUrl: "",
    password: "",
  });
  const [touched, setTouched] = useState<Record<FormField, boolean>>({
    displayName: false,
    phoneNumber: false,
    rollNo: false,
    idCardImageUrl: false,
    password: false,
  });
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" }>({
    text: "",
    type: "success",
  });

  const formFields: FormField[] = ["displayName", "phoneNumber", "rollNo", "idCardImageUrl", "password"];

  const getFieldError = (field: FormField, value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "THIS FIELD IS REQUIRED.";
    }

    switch (field) {
      case "displayName":
        if (trimmedValue.length < 3) {
          return "ENTER YOUR FULL NAME.";
        }
        if (!/^[A-Z][A-Z .'-]{2,}$/i.test(trimmedValue)) {
          return "USE A VALID NAME FORMAT.";
        }
        return "";
      case "phoneNumber": {
        const digits = trimmedValue.replace(/\D/g, "");
        if (!(digits.length === 10 || (digits.length === 12 && digits.startsWith("91")))) {
          return "ENTER A VALID 10-DIGIT PHONE NUMBER.";
        }
        return "";
      }
      case "rollNo":
        if (!/^[A-Z0-9/-]{6,20}$/i.test(trimmedValue)) {
          return "USE A VALID ROLL NUMBER.";
        }
        return "";
      case "idCardImageUrl":
        try {
          const url = new URL(trimmedValue);
          if (!["http:", "https:"].includes(url.protocol)) {
            return "USE A VALID IMAGE URL.";
          }
          return "";
        } catch {
          return "USE A VALID IMAGE URL.";
        }
      case "password":
        if (trimmedValue.length < 6) {
          return "RECOVERY SEAL MUST BE AT LEAST 6 CHARACTERS.";
        }
        return "";
      default:
        return "";
    }
  };

  const setFieldTouched = (field: FormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: getFieldError(field, form[field]) }));
  };

  const updateField = (field: FormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: getFieldError(field, value) }));
    }

    if (statusMessage.text) {
      setStatusMessage({ text: "", type: "success" });
    }
  };

  const validateFields = (fields: FormField[]) => {
    const nextErrors = fields.reduce<Record<FormField, string>>(
      (acc, field) => {
        acc[field] = getFieldError(field, form[field]);
        return acc;
      },
      {
        displayName: errors.displayName,
        phoneNumber: errors.phoneNumber,
        rollNo: errors.rollNo,
        idCardImageUrl: errors.idCardImageUrl,
        password: errors.password,
      }
    );

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return fields.every((field) => !nextErrors[field]);
  };

  const isFieldValid = (field: FormField) => form[field].trim().length > 0 && !getFieldError(field, form[field]);

  const getFieldMessage = (field: FormField, successMessage: string, helperMessage: string) => {
    if (errors[field]) {
      return { text: errors[field], tone: "error" as const };
    }

    if (isFieldValid(field)) {
      return { text: successMessage, tone: "success" as const };
    }

    return { text: helperMessage, tone: "muted" as const };
  };

  const currentField = formFields[activeStep] ?? null;
  const isCurrentStepValid = currentField ? isFieldValid(currentField) : formFields.every((field) => isFieldValid(field));
  const isFormValid = formFields.every((field) => isFieldValid(field));

  const isBitMesra = user?.primaryEmail?.toLowerCase().endsWith("@bitmesra.ac.in");

  useEffect(() => {
    async function checkStatus() {
      if (user) {
        const ticketExists = await hasTicket(user.id);
        const existingDbUser = await getUser(user.id);
        setHasUserTicket(ticketExists);
        if (existingDbUser) {
          setDbUser(existingDbUser);
          setForm({
            displayName: existingDbUser.displayName || user.displayName || "",
            phoneNumber: existingDbUser.phoneNumber || "",
            rollNo: existingDbUser.rollNo || "",
            idCardImageUrl: existingDbUser.idCardImageUrl || user.profileImageUrl || "",
            password: "",
          });
        }
      }
      setChecking(false);
    }
    checkStatus();
  }, [user]);

  useEffect(() => {
    setShowPass(false);
    setIsPassUnlocked(false);
    setUnlockPassword("");
    setUnlockError("");
  }, [hasUserTicket, dbUser?.id]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const qrData = hasUserTicket ? JSON.stringify({ 
    id: btoa(user?.primaryEmail || user?.id || ""), 
    name: dbUser?.displayName || user?.displayName || "Guest", 
    type: "HERITAGE_ARTISAN_PASS", 
    valid: true 
  }) : "";

  const createQrOptions = (size: number) => ({
    width: size,
    height: size,
    type: "svg" as const,
    data: qrData,
    margin: 0,
    image: "/assets/logo.png",
    qrOptions: {
      errorCorrectionLevel: "Q" as const,
      mode: "Byte" as const,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      hideBackgroundDots: true,
      imageSize: 0.24,
      margin: 8,
    },
    backgroundOptions: {
      color: "#FDF5E6",
    },
    dotsOptions: {
      type: "extra-rounded" as const,
      gradient: {
        type: "linear" as const,
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: "#1A0505" },
          { offset: 1, color: "#D4AF37" },
        ],
      },
    },
    cornersSquareOptions: {
      type: "extra-rounded" as const,
      color: "#1A0505",
    },
    cornersDotOptions: {
      type: "dot" as const,
      color: "#B8860B",
    },
  });

  useEffect(() => {
    if (!hasUserTicket || !qrData) {
      return;
    }

    let cancelled = false;

    const mountQr = async () => {
      const { default: QRCodeStyling } = await import("qr-code-styling");

      const attachQr = (
        container: HTMLDivElement | null,
        instanceRef: MutableRefObject<any>,
        size: number
      ) => {
        if (!container || cancelled) {
          return;
        }

        const options = createQrOptions(size);

        if (!instanceRef.current) {
          instanceRef.current = new QRCodeStyling(options);
        } else {
          instanceRef.current.update(options);
        }

        container.innerHTML = "";
        instanceRef.current.append(container);
      };

      attachQr(visibleQrRef.current, visibleQrInstanceRef, 320);
      attachQr(exportQrRef.current, exportQrInstanceRef, 220);
    };

    void mountQr();

    return () => {
      cancelled = true;
    };
  }, [hasUserTicket, qrData, showPass]);

  const handleNext = () => {
    const field = formFields[activeStep];

    if (field) {
      setTouched((prev) => ({ ...prev, [field]: true }));

      if (!validateFields([field])) {
        setStatusMessage({ text: "PLEASE CORRECT THE HIGHLIGHTED FIELD BEFORE CONTINUING.", type: "error" });
        return;
      }
    }

    setStatusMessage({ text: "", type: "success" });
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const verifyUnlockPassword = async () => {
    if (!user) {
      return false;
    }

    const enteredPassword = unlockPassword.trim();

    if (!enteredPassword) {
      setUnlockError("ENTER YOUR RECOVERY SEAL TO UNLOCK THE PASS.");
      return false;
    }

    setUnlockingPass(true);

    const result = await verifyTicketUnlockPassword(user.id, enteredPassword);

    if (!result.success) {
      setUnlockError("INCORRECT RECOVERY SEAL.");
      setUnlockingPass(false);
      return false;
    }

    setUnlockError("");
    setIsPassUnlocked(true);
    setShowPass(true);
    setStatusMessage({ text: "PASS UNLOCKED. QR AND PDF EXPORT ARE NOW AVAILABLE.", type: "success" });
    setUnlockingPass(false);
    return true;
  };

  const handleRelockPass = () => {
    setShowPass(false);
    setIsPassUnlocked(false);
    setUnlockPassword("");
    setUnlockError("");
    setStatusMessage({ text: "PASS LOCKED AGAIN.", type: "success" });
  };

  const handleExportPdf = async () => {
    if (!isPassUnlocked) {
      setUnlockError("UNLOCK THE PASS WITH YOUR RECOVERY SEAL BEFORE EXPORTING THE PDF.");
      setStatusMessage({ text: "PASS IS LOCKED. ENTER YOUR RECOVERY SEAL FIRST.", type: "error" });
      return;
    }

    if (!passExportRef.current) {
      return;
    }

    setExportingPdf(true);
    setStatusMessage({ text: "PREPARING YOUR PASS PDF...", type: "success" });

    try {
      if (exportQrRef.current && !exportQrInstanceRef.current) {
        const { default: QRCodeStyling } = await import("qr-code-styling");
        exportQrInstanceRef.current = new QRCodeStyling(createQrOptions(220));
        exportQrRef.current.innerHTML = "";
        exportQrInstanceRef.current.append(exportQrRef.current);
      }

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(passExportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f5ecd6",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`bitotsav-pass-${user?.id?.slice(-8) ?? "ticket"}.pdf`);
      setStatusMessage({ text: "PASS PDF DOWNLOADED.", type: "success" });
    } catch (error) {
      console.error(error);
      setStatusMessage({ text: "FAILED TO EXPORT PASS PDF.", type: "error" });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, idCardImageUrl: "UPLOAD A JPG, PNG, WEBP OR GIF IMAGE." }));
      setTouched((prev) => ({ ...prev, idCardImageUrl: true }));
      setStatusMessage({ text: "UNSUPPORTED IMAGE FORMAT.", type: "error" });
      return;
    }

    if (file.size > 32 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, idCardImageUrl: "IMAGE MUST BE 32MB OR SMALLER." }));
      setTouched((prev) => ({ ...prev, idCardImageUrl: true }));
      setStatusMessage({ text: "IMAGE FILE IS TOO LARGE.", type: "error" });
      return;
    }

    setUploadingImage(true);
    setTouched((prev) => ({ ...prev, idCardImageUrl: true }));
    setStatusMessage({ text: "UPLOADING IDENTIFICATION IMAGE...", type: "success" });

    try {
      const payload = new FormData();
      payload.append("image", file);
      payload.append("name", `${user?.id ?? "bitotsav-user"}-id-card`);

      const response = await fetch("/api/imgbb-upload", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

      if (!response.ok || !result?.success || !result?.url) {
        throw new Error(result?.message || "UPLOAD_FAILED");
      }

      updateField("idCardImageUrl", result.url);
      setErrors((prev) => ({ ...prev, idCardImageUrl: "" }));
      setStatusMessage({ text: "IDENTIFICATION IMAGE UPLOADED SUCCESSFULLY.", type: "success" });
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, idCardImageUrl: "IMAGE UPLOAD FAILED. TRY AGAIN." }));
      setStatusMessage({ text: "FAILED TO UPLOAD IDENTIFICATION IMAGE.", type: "error" });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFinalize = async () => {
    if (!user) return;

    setTouched({
      displayName: true,
      phoneNumber: true,
      rollNo: true,
      idCardImageUrl: true,
      password: true,
    });

    if (!validateFields(formFields)) {
      setStatusMessage({ text: "PLEASE FILL ALL FIELDS CORRECTLY BEFORE MINTING THE PASS.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const updateResult = await updateUserDetails(user.id, form);
      if (!updateResult.success) {
        setStatusMessage({ text: updateResult.message || "PROFILE UPDATE FAILED.", type: "error" });
        return;
      }

      const ticketResult = await createTicket(user.id);
      if (ticketResult.success) {
        setStatusMessage({ text: "PASS MINTED SUCCESSFULLY.", type: "success" });
        window.location.reload();
        return;
      }

      setStatusMessage({ text: ticketResult.message || "TICKET GENERATION FAILED.", type: "error" });
    } catch (error) {
      console.error(error);
      setStatusMessage({ text: "SOMETHING WENT WRONG. PLEASE TRY AGAIN.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center">
            <Skeleton className="w-full max-w-[500px] aspect-[1/1.6] rounded-[2rem] mb-12" />
            <div className="w-full max-w-[450px] space-y-8">
              <Skeleton className="h-12 w-3/4 rounded-lg" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
            </div>
        </div>
      </PageWrapper>
    );
  }

  if (!user) {
    return (
      <PageWrapper className="pt-32 pb-20 bg-[#1A0505] min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 tapestry-pattern" />
        <div className="relative z-10 text-center space-y-12 max-w-2xl px-6">
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.8 }}
             className="inline-block p-1 bg-linear-to-b from-[#D4AF37] to-transparent"
           >
             <div className="bg-[#1A0505] p-8">
               <Lock className="w-12 h-12 text-[#D4AF37]" />
             </div>
           </motion.div>
           <h1 className="text-7xl md:text-9xl font-black italic text-[#FDF5E6] uppercase tracking-tighter leading-none font-heading">
             HERITAGE <br/> <span className="text-[#D4AF37]">LOCKED.</span>
           </h1>
           <p className="text-[#FDF5E6]/40 text-sm md:text-lg font-black uppercase tracking-[0.5em] font-heading">
             REVEAL YOUR LINEAGE TO ACCESS THE SANCTUARY
           </p>
           <button 
             onClick={() => window.location.href = "/handler/sign-in"}
             className="w-full py-6 bg-linear-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] text-[#1A0505] font-black uppercase tracking-[0.3em] text-xs hover:tracking-[0.5em] transition-all font-heading shadow-[0_0_50px_rgba(212,175,55,0.3)]"
           >
             VERIFY IDENTITY
           </button>
        </div>
      </PageWrapper>
    );
  }

  if (hasUserTicket) {
    return (
      <PageWrapper className="pt-24 md:pt-32 pb-20 bg-[#1A0505] min-h-screen relative overflow-hidden tapestry-bg">
        <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
          {/* Header Protocol */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex justify-between items-center mb-12 md:mb-20 print:hidden"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity" />
                <Award className="w-5 h-5" />
              </div>
              <div className="hidden md:block">
                <p className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] opacity-40 font-heading">PROTOCOL ACTIVE</p>
                <p className="text-xs font-black uppercase text-[#FDF5E6] tracking-tighter font-heading">HERITAGE_MINT_35</p>
              </div>
            </div>

            <button 
                onClick={() => window.location.href = "/profile"}
                className="px-6 py-3 border-2 border-[#D4AF37]/20 text-[#D4AF37]/60 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all font-heading"
            >
                <ChevronLeft className="w-3 h-3" />
                RETURN TO HUB
            </button>
          </motion.div>

          {/* Pass Container */}
          <div className="w-full flex flex-col xl:flex-row gap-12 items-center xl:items-start justify-center">
            {/* The Cinematic Artifact */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: 1000,
              }}
              className="relative w-full max-w-[500px] aspect-[1/1.6] group print:max-w-none print:aspect-auto"
            >
              <motion.div
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-full h-full bg-[#FDF5E6] rounded-[2rem] overflow-hidden border-8 border-[#1A0505] shadow-[0_50px_100px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[#D4AF37]/10 stamp-edge"
              >
                {/* Background Textures */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none tapestry-pattern contrast-[2] mix-blend-multiply" />
                <div className="absolute inset-0 bg-linear-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

                {/* Left Side Trim */}
                <div className="absolute top-0 left-0 h-full w-12 bg-[#1A0505] flex flex-col items-center justify-between py-12">
                   <div className="text-[8px] font-black uppercase tracking-[0.5em] text-[#D4AF37] opacity-40 rotate-180 [writing-mode:vertical-lr] font-heading">
                      BITOTSAV MMXXVI
                   </div>
                   <div className="w-4 h-4 rounded-full border border-[#D4AF37]/20" />
                   <div className="text-[8px] font-black uppercase tracking-[0.5em] text-[#D4AF37] opacity-40 rotate-180 [writing-mode:vertical-lr] font-heading">
                      ARTIFACT NO. {user.id.slice(-8).toUpperCase()}
                   </div>
                </div>

                {/* Main Content Area */}
                <div className="ml-12 h-full flex flex-col p-10 md:p-14">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start mb-12">
                     <div className="space-y-1">
                        <div className="px-3 py-1 bg-[#1A0505] text-[#D4AF37] text-[7px] font-black uppercase tracking-[0.3em] rounded-full inline-block font-heading">
                           AUTHENTIC PASS
                        </div>
                        <h3 className="text-3xl font-black italic text-[#1A0505] tracking-tighter leading-none font-heading">
                          HERITAGE <br/> <span className="text-[#D4AF37]">ARTISAN.</span>
                        </h3>
                     </div>
                     <div className="w-16 h-16 bg-[#1A0505] rounded-2xl flex items-center justify-center transform rotate-12 -mr-4 mt-2">
                        <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
                     </div>
                  </div>

                  {/* Member Section */}
                  <div className="relative flex-1">
                    <div className="aspect-square relative mb-8">
                       <div className="absolute inset-0 border-4 border-[#1A0505]/10 rounded-3xl" />
                       <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center border-4 border-[#FDF5E6] z-20">
                          <CheckCircle className="w-6 h-6 text-[#1A0505]" />
                       </div>
                       <div className="w-full h-full rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xs relative group-hover:scale-105 transition-transform duration-700">
                          {dbUser?.idCardImageUrl || user?.profileImageUrl ? (
                                <NextImage 
                                  src={dbUser?.idCardImageUrl || user?.profileImageUrl || ""} 
                                  alt="Member" 
                                  fill
                                  className="object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-700" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-8xl font-black italic text-[#1A0505]/10 font-heading">
                                    {(dbUser?.displayName || user?.displayName || user?.primaryEmail || "?")[0]?.toUpperCase()}
                                </div>
                            )}
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A0505]/40 font-heading">ARTISAN NAME</p>
                         <h2 className="text-4xl md:text-5xl font-black italic text-[#1A0505] uppercase tracking-tighter leading-none font-heading underline decoration-[#D4AF37] decoration-4 underline-offset-4">
                           {dbUser?.displayName || user?.displayName || "GUEST"}
                         </h2>
                       </div>

                       <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#1A0505]/5">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#1A0505]/30 font-heading">ORIGIN AFFILIATION</p>
                            <p className="text-xs font-black uppercase text-[#1A0505] tracking-tighter font-heading">{isBitMesra ? "BIT MESRA" : dbUser?.collegeName || "CRAFTSMAN"}</p>
                          </div>
                          <div className="space-y-1 pl-4 border-l border-[#1A0505]/5">
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#1A0505]/30 font-heading">VALIDITY</p>
                            <p className="text-xs font-black uppercase text-[#D4AF37] tracking-tighter font-heading">MMXXVI CONFIRMED</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Pass Footer */}
                  <div className="mt-auto flex justify-between items-end border-t-2 border-[#1A0505] pt-6">
                     <div className="space-y-1">
                        <p className="text-[7px] font-black uppercase tracking-[0.4em] text-[#1A0505]/40 font-heading">BITOTSAV 2026</p>
                        <p className="text-[10px] font-black uppercase text-[#1A0505] font-heading">GAATHA GATEWAY</p>
                     </div>
                     <div className="text-right">
                        <Fingerprint className="w-8 h-8 text-[#1A0505]/10 ml-auto mb-1" />
                        <p className="text-[6px] font-black uppercase tracking-widest text-[#1A0505]/20 font-heading">{user.id}</p>
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Interaction Sanctuary */}
            <div className="w-full max-w-[450px] space-y-6 flex flex-col justify-center print:hidden">
              <div className="rounded-[2rem] border border-[#D4AF37]/20 bg-white/[0.03] p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2">
                    <ScanLine className="h-4 w-4 text-[#D4AF37]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#D4AF37] font-heading">ENTRY VERIFICATION</span>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-[#FDF5E6] font-heading">
                    DIGITAL <span className="text-[#D4AF37]">SIGIL.</span>
                  </h4>
                  <p className="text-[#FDF5E6]/45 text-sm font-black uppercase tracking-[0.22em] leading-relaxed font-heading">
                    Clean scan, faster verification, and a festival-ready pass card that matches the Bitotsav theme.
                  </p>
                </div>

                <div className="mt-8 relative">
                  <AnimatePresence mode="wait">
                    {!showPass ? (
                      <motion.div
                        key="reveal"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="w-full rounded-[2rem] border border-[#D4AF37]/20 bg-linear-to-br from-[#D4AF37]/10 via-white/5 to-[#D4AF37]/5 p-8 text-left"
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-5">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.25)]">
                              <Lock className="h-7 w-7 text-[#1A0505]" />
                            </div>
                            <div>
                              <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.4em] font-heading">PASSWORD LOCK ENABLED</p>
                              <p className="mt-3 text-2xl font-black italic uppercase tracking-tighter text-[#FDF5E6] font-heading">
                                UNLOCK YOUR SCAN PASS
                              </p>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#1A0505]/60 p-4">
                            <QrCode className="h-12 w-12 text-[#D4AF37]" />
                          </div>
                        </div>

                        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#FDF5E6]/55 font-heading">
                          Enter the recovery seal you created during ticket minting to reveal the QR and enable PDF export.
                        </p>

                        <div className="mt-6 space-y-4">
                          <input
                            type="password"
                            value={unlockPassword}
                            onChange={(e) => {
                              setUnlockPassword(e.target.value);
                              if (unlockError) {
                                setUnlockError("");
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                void verifyUnlockPassword();
                              }
                            }}
                            placeholder="ENTER RECOVERY SEAL"
                            className={cn(
                              "w-full rounded-2xl border bg-[#1A0505]/40 px-5 py-4 text-[#FDF5E6] font-black uppercase tracking-[0.25em] outline-hidden font-heading placeholder:text-[#FDF5E6]/20",
                              unlockError ? "border-red-500" : "border-[#D4AF37]/20 focus:border-[#D4AF37]"
                            )}
                          />

                          {unlockError ? (
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 font-heading">
                              {unlockError}
                            </p>
                          ) : (
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FDF5E6]/35 font-heading">
                              This is the same password used later for pass unlocking.
                            </p>
                          )}

                          <button
                            onClick={() => void verifyUnlockPassword()}
                            disabled={unlockingPass}
                            className={cn(
                              "w-full rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-[0.35em] text-[#1A0505] transition-colors font-heading",
                              unlockingPass ? "bg-[#8A7530] cursor-not-allowed" : "bg-[#D4AF37] hover:bg-[#e3bc45]"
                            )}
                          >
                            {unlockingPass ? "VERIFYING RECOVERY SEAL" : "UNLOCK QR AND PDF"}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="qr"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        className="rounded-[2rem] border border-[#D4AF37]/20 bg-linear-to-br from-[#f7efd8] via-[#FDF5E6] to-[#efe0b8] p-5 md:p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
                      >
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-[0.35em] text-[#1A0505]/45 font-heading">AUTHENTICATED SCAN TOKEN</p>
                            <p className="mt-2 text-xl font-black italic uppercase tracking-tighter text-[#1A0505] font-heading">
                              PRESENT AT ENTRY DESK
                            </p>
                          </div>
                          <button
                            onClick={handleRelockPass}
                            className="rounded-full border border-[#1A0505]/10 px-4 py-2 text-[8px] font-black uppercase tracking-[0.35em] text-[#1A0505]/60 transition-all hover:border-[#1A0505]/30 hover:text-[#1A0505] font-heading"
                          >
                            LOCK AGAIN
                          </button>
                        </div>

                        <div className="rounded-[1.75rem] border border-[#1A0505]/10 bg-white/80 p-4 shadow-inner">
                          <div
                            ref={visibleQrRef}
                            className="mx-auto flex aspect-square w-full max-w-[320px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#FDF5E6]"
                          />
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                          <div className="rounded-2xl border border-[#1A0505]/10 bg-[#1A0505]/5 px-3 py-4">
                            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-[#1A0505]/40 font-heading">Status</p>
                            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A0505] font-heading">Active</p>
                          </div>
                          <div className="rounded-2xl border border-[#1A0505]/10 bg-[#1A0505]/5 px-3 py-4">
                            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-[#1A0505]/40 font-heading">Edition</p>
                            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A0505] font-heading">MMXXVI</p>
                          </div>
                          <div className="rounded-2xl border border-[#1A0505]/10 bg-[#1A0505]/5 px-3 py-4">
                            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-[#1A0505]/40 font-heading">Holder</p>
                            <p className="mt-2 truncate text-[10px] font-black uppercase tracking-[0.2em] text-[#1A0505] font-heading">
                              {(dbUser?.displayName || user?.displayName || "Guest").split(" ")[0]}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  onClick={handleExportPdf}
                  disabled={exportingPdf}
                  className={cn(
                    "rounded-[1.5rem] border px-5 py-5 text-left transition-all font-heading",
                    exportingPdf
                      ? "border-white/10 bg-white/5 text-[#FDF5E6]/30 cursor-not-allowed"
                      : "border-white/10 bg-white/5 text-[#FDF5E6]/70 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:text-[#FDF5E6]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {exportingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    <span className="text-[9px] font-black uppercase tracking-[0.35em]">EXPORT PASS PDF</span>
                  </div>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] opacity-60">
                    {isPassUnlocked ? "Download a clean PDF with your pass card and styled QR." : "Unlock the pass with your recovery seal before exporting the PDF."}
                  </p>
                </button>

                <Link
                  href={SITE_CONFIG.whatsapp.community}
                  target="_blank"
                  className="rounded-[1.5rem] border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-5 text-left transition-all hover:border-[#25D366]/60 hover:bg-[#25D366]/15 font-heading"
                >
                  <div className="flex items-center gap-3 text-[#8CF5B3]">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.35em]">JOIN WHATSAPP GROUP</span>
                  </div>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#DFFFE9]/70">
                    Use the community group for edit requests, updates, and pass help.
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-none fixed -left-[9999px] top-0 opacity-0">
            <div ref={passExportRef} className="w-[1200px] overflow-hidden rounded-[40px] border-[10px] border-[#1A0505] bg-[#f5ecd6] p-10 text-[#1A0505]">
              <div className="grid grid-cols-[1.15fr_0.85fr] gap-8">
                <div className="overflow-hidden rounded-[32px] border border-[#1A0505]/15 bg-[#FDF5E6] p-8">
                  <div className="flex items-start justify-between border-b border-[#1A0505]/10 pb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#1A0505]/45 font-heading">Bitotsav 2026 Verified Pass</p>
                      <h3 className="mt-3 text-5xl font-black italic uppercase tracking-tighter font-heading">
                        Heritage <span className="text-[#B8860B]">Artisan</span>
                      </h3>
                    </div>
                    <div className="rounded-3xl bg-[#1A0505] p-4">
                      <ShieldCheck className="h-10 w-10 text-[#D4AF37]" />
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-[220px_1fr] gap-8">
                    <div className="relative aspect-square overflow-hidden rounded-[28px] border-4 border-[#1A0505]/10 bg-white/60">
                      {dbUser?.idCardImageUrl || user?.profileImageUrl ? (
                        <NextImage
                          src={dbUser?.idCardImageUrl || user?.profileImageUrl || ""}
                          alt="Member"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-7xl font-black italic text-[#1A0505]/10 font-heading">
                          {(dbUser?.displayName || user?.displayName || user?.primaryEmail || "?")[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A0505]/35 font-heading">Artisan Name</p>
                        <p className="mt-3 text-5xl font-black italic uppercase tracking-tighter font-heading">
                          {dbUser?.displayName || user?.displayName || "Guest"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="rounded-[24px] border border-[#1A0505]/10 bg-[#1A0505]/[0.03] p-5">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1A0505]/35 font-heading">Affiliation</p>
                          <p className="mt-2 text-xl font-black uppercase tracking-[0.2em] font-heading">{isBitMesra ? "BIT MESRA" : dbUser?.collegeName || "CRAFTSMAN"}</p>
                        </div>
                        <div className="rounded-[24px] border border-[#1A0505]/10 bg-[#1A0505]/[0.03] p-5">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1A0505]/35 font-heading">Roll Number</p>
                          <p className="mt-2 text-xl font-black uppercase tracking-[0.2em] font-heading">{dbUser?.rollNo || "N/A"}</p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-5">
                        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#1A0505]/45 font-heading">Entry Instructions</p>
                        <p className="mt-3 text-sm font-black uppercase tracking-[0.2em] text-[#1A0505]/75 font-heading">
                          Keep this PDF with you and present the QR code at the gate for verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[32px] border border-[#1A0505]/15 bg-[#1A0505] p-8 text-[#FDF5E6]">
                  <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#D4AF37]/60 font-heading">Scan Protocol</p>
                  <h4 className="mt-3 text-4xl font-black italic uppercase tracking-tighter font-heading">
                    Festival Entry QR
                  </h4>
                  <div className="mt-8 rounded-[28px] bg-[#FDF5E6] p-5">
                    <div ref={exportQrRef} className="mx-auto flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-[24px]" />
                  </div>

                  <div className="mt-8 grid gap-4">
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/55 font-heading">Pass Holder</p>
                      <p className="mt-2 text-lg font-black uppercase tracking-[0.2em] text-[#FDF5E6] font-heading">{dbUser?.displayName || user?.displayName || "Guest"}</p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/55 font-heading">Artifact ID</p>
                      <p className="mt-2 text-lg font-black uppercase tracking-[0.2em] text-[#FDF5E6] font-heading">{user.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/55 font-heading">WhatsApp Community</p>
                      <p className="mt-2 text-sm font-black tracking-[0.08em] text-[#FDF5E6]/80 font-heading">{SITE_CONFIG.whatsapp.community}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Minting Flow View (Keep the logic, wrap in a premium intake UI)
  const StepIcon = steps[activeStep].icon;
  return (
    <PageWrapper className="pt-24 md:pt-32 pb-20 bg-[#1A0505] min-h-screen relative overflow-hidden tapestry-bg">
      <div className="absolute inset-0 z-0 pointer-events-none tapestry-pattern opacity-10" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="mb-20 text-center md:text-left">
           <motion.div 
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="inline-flex items-center gap-3 px-4 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-8"
           >
              <Fingerprint className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] font-heading">BIT MESRA INTAKE PROTOCOL</span>
           </motion.div>
           <h1 className="text-6xl md:text-8xl font-black italic text-[#FDF5E6] uppercase tracking-tighter leading-none font-heading">
             MINT YOUR <br/> <span className="text-[#D4AF37]">HERITAGE.</span>
           </h1>
        </div>

        <div className="bg-[#D4AF37]/5 border-2 border-[#D4AF37]/20 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
           {/* Progress Tracker */}
           <div className="h-1.5 bg-white/5 flex gap-1">
             {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex-1 h-full transition-all duration-1000",
                    i <= activeStep ? "bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]" : "bg-white/5"
                  )} 
                />
             ))}
           </div>

           <div className="p-8 md:p-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="space-y-16"
                >
                  <div className="flex flex-col md:flex-row items-center gap-10">
                     <div className="w-24 h-24 bg-[#D4AF37] flex items-center justify-center rounded-3xl transform rotate-12 shadow-[10px_10px_0px_rgba(212,175,55,0.2)]">
                        <StepIcon className="w-10 h-10 text-[#1A0505]" />
                     </div>
                     <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-[#FDF5E6] font-heading leading-tight">{steps[activeStep].title}</h2>
                        <p className="text-[#D4AF37]/60 text-xs font-black uppercase tracking-[0.4em] font-heading mt-2">{steps[activeStep].subtitle}</p>
                     </div>
                  </div>

                  <div className="min-h-[200px]">
                    {activeStep === 0 && (
                       <div className="space-y-6">
                          <p className="text-[#FDF5E6]/40 text-xs font-black uppercase font-heading tracking-widest">ENTER YOUR LEGAL IDENTITY TO BE ETCHED INTO THE ARCHIVES.</p>
                          <input 
                            type="text"
                            value={form.displayName}
                            onChange={(e) => updateField("displayName", e.target.value)}
                            onBlur={() => setFieldTouched("displayName")}
                            placeholder="NAME AS PER RECORDS"
                            aria-invalid={Boolean(errors.displayName)}
                            className={cn(
                              "w-full bg-white/5 border-b-4 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-4xl md:text-6xl outline-hidden font-heading transition-all placeholder:opacity-10",
                              errors.displayName ? "border-red-500" : "border-white/10 focus:border-[#D4AF37]"
                            )}
                          />
                          {(() => {
                            const message = getFieldMessage("displayName", "IDENTITY VERIFIED.", "ENTER YOUR FULL NAME.");
                            return (
                              <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] font-heading",
                                message.tone === "error" ? "text-red-500" : message.tone === "success" ? "text-green-500" : "text-[#FDF5E6]/30"
                              )}>
                                {message.text}
                              </p>
                            );
                          })()}
                       </div>
                    )}

                    {activeStep === 1 && (
                       <div className="space-y-6">
                          <p className="text-[#FDF5E6]/40 text-xs font-black uppercase font-heading tracking-widest">FOR EMERGENCY TRANSMISSIONS AND VERIFICATION.</p>
                          <input 
                            type="tel"
                            value={form.phoneNumber}
                            onChange={(e) => updateField("phoneNumber", e.target.value.replace(/[^\d+\s()-]/g, ""))}
                            onBlur={() => setFieldTouched("phoneNumber")}
                            placeholder="+91 XXXXX XXXXX"
                            maxLength={16}
                            aria-invalid={Boolean(errors.phoneNumber)}
                            className={cn(
                              "w-full bg-white/5 border-b-4 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-4xl md:text-6xl outline-hidden font-heading transition-all placeholder:opacity-10",
                              errors.phoneNumber ? "border-red-500" : "border-white/10 focus:border-[#D4AF37]"
                            )}
                          />
                          {(() => {
                            const message = getFieldMessage("phoneNumber", "COMMUNICATION CHANNEL VERIFIED.", "ENTER A 10-DIGIT PHONE NUMBER.");
                            return (
                              <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] font-heading",
                                message.tone === "error" ? "text-red-500" : message.tone === "success" ? "text-green-500" : "text-[#FDF5E6]/30"
                              )}>
                                {message.text}
                              </p>
                            );
                          })()}
                       </div>
                    )}

                    {activeStep === 2 && (
                       <div className="space-y-6">
                          <p className="text-[#FDF5E6]/40 text-xs font-black uppercase font-heading tracking-widest">YOUR ACADEMIC SIGNIFIER AT THE INSTITUTE.</p>
                          <input 
                            type="text"
                            value={form.rollNo}
                            onChange={(e) => updateField("rollNo", e.target.value.toUpperCase())}
                            onBlur={() => setFieldTouched("rollNo")}
                            placeholder="BTECH/10574/24"
                            maxLength={20}
                            aria-invalid={Boolean(errors.rollNo)}
                            className={cn(
                              "w-full bg-white/5 border-b-4 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-4xl md:text-6xl outline-hidden font-heading transition-all placeholder:opacity-10",
                              errors.rollNo ? "border-red-500" : "border-white/10 focus:border-[#D4AF37]"
                            )}
                          />
                          {(() => {
                            const message = getFieldMessage("rollNo", "ACADEMIC SIGNIFIER VERIFIED.", "USE LETTERS, NUMBERS, / OR - ONLY.");
                            return (
                              <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] font-heading",
                                message.tone === "error" ? "text-red-500" : message.tone === "success" ? "text-green-500" : "text-[#FDF5E6]/30"
                              )}>
                                {message.text}
                              </p>
                            );
                          })()}
                       </div>
                    )}

                    {activeStep === 3 && (
                       <div className="space-y-6">
                          <p className="text-[#FDF5E6]/40 text-xs font-black uppercase font-heading tracking-widest">PASTE THE DIRECT URL OF YOUR IDENTIFICATION IMAGE OR UPLOAD IT DIRECTLY.</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                void handleImageUpload(file);
                              }
                            }}
                            className="hidden"
                          />
                          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className={cn(
                                "flex items-center justify-center gap-3 rounded-2xl border px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] font-heading transition-all",
                                uploadingImage
                                  ? "border-[#D4AF37]/10 bg-white/5 text-[#FDF5E6]/40 cursor-not-allowed"
                                  : "border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15"
                              )}
                            >
                              {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                              {uploadingImage ? "UPLOADING IMAGE" : "UPLOAD IMAGE"}
                            </button>

                            {form.idCardImageUrl ? (
                              <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-white/5 min-h-[120px]">
                                <NextImage
                                  src={form.idCardImageUrl}
                                  alt="Identification preview"
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#1A0505] to-transparent px-4 py-3">
                                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FDF5E6] font-heading">
                                    PREVIEW READY
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 text-center">
                                <div className="space-y-2">
                                  <ImagePlus className="mx-auto h-6 w-6 text-[#D4AF37]/60" />
                                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FDF5E6]/30 font-heading">
                                    JPG, PNG, WEBP OR GIF
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          <input 
                            type="text"
                            value={form.idCardImageUrl}
                            onChange={(e) => updateField("idCardImageUrl", e.target.value)}
                            onBlur={() => setFieldTouched("idCardImageUrl")}
                            placeholder="HTTPS://IMAGE.URL"
                            aria-invalid={Boolean(errors.idCardImageUrl)}
                            className={cn(
                              "w-full bg-white/5 border-b-4 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-2xl md:text-4xl outline-hidden font-heading transition-all placeholder:opacity-10",
                              errors.idCardImageUrl ? "border-red-500" : "border-white/10 focus:border-[#D4AF37]"
                            )}
                          />
                          {(() => {
                            const message = getFieldMessage("idCardImageUrl", "IDENTIFICATION IMAGE VERIFIED.", "UPLOAD AN IMAGE OR PASTE A PUBLIC HTTP OR HTTPS IMAGE URL.");
                            return (
                              <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] font-heading",
                                message.tone === "error" ? "text-red-500" : message.tone === "success" ? "text-green-500" : "text-[#FDF5E6]/30"
                              )}>
                                {message.text}
                              </p>
                            );
                          })()}
                          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#FDF5E6]/20 font-heading">
                            LOCAL FILES ARE SECURELY UPLOADED BEFORE THE PASS IS GENERATED.
                          </p>
                       </div>
                    )}

                    {activeStep === 4 && (
                       <div className="space-y-12">
                          <div className="p-8 bg-red-600/10 border-2 border-red-600/20 rounded-3xl flex items-start gap-8">
                             <Lock className="w-10 h-10 text-red-600 shrink-0 mt-1" />
                             <div>
                               <p className="text-red-600 font-black uppercase text-sm font-heading mb-2 tracking-tighter">CRITICAL: RECOVERY SEAL REQUIRED</p>
                               <p className="text-red-600/60 text-[10px] font-black uppercase leading-relaxed tracking-wider font-heading">
                                 WE REQUIRE A SECONDARY SEAL TO VERIFY YOUR LINEAGE MANUALLY AT THE GATES IF DEVICES FAIL. REMEMBER THIS PASSWORD. YOU WILL NEED IT LATER TO UNLOCK YOUR QR AND PASS PDF.
                               </p>
                             </div>
                          </div>
                          <input 
                            type="password"
                            value={form.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            onBlur={() => setFieldTouched("password")}
                            placeholder="••••••••"
                            aria-invalid={Boolean(errors.password)}
                            className={cn(
                              "w-full bg-white/5 border-b-4 p-4 text-[#FDF5E6] font-black uppercase tracking-tighter text-4xl md:text-6xl outline-hidden font-heading transition-all placeholder:opacity-10",
                              errors.password ? "border-red-500" : "border-white/10 focus:border-[#D4AF37]"
                            )}
                          />
                          {(() => {
                            const message = getFieldMessage("password", "RECOVERY SEAL ACCEPTED. REMEMBER IT FOR QR UNLOCK.", "SET A RECOVERY SEAL WITH AT LEAST 6 CHARACTERS. YOU WILL USE IT LATER TO UNLOCK THE PASS.");
                            return (
                              <p className={cn(
                                "text-[10px] font-black uppercase tracking-[0.3em] font-heading",
                                message.tone === "error" ? "text-red-500" : message.tone === "success" ? "text-green-500" : "text-[#FDF5E6]/30"
                              )}>
                                {message.text}
                              </p>
                            );
                          })()}
                       </div>
                    )}

                    {activeStep === 5 && (
                       <div className="space-y-8">
                          <div className="p-10 bg-white/5 border border-white/10 rounded-3xl relative group overflow-hidden">
                             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck className="w-40 h-40 text-[#D4AF37]" />
                             </div>
                             <h4 className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.5em] mb-12 font-heading">SUMMARIZING LINEAGE</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-4">
                                   <div className="space-y-1">
                                      <p className="text-[#FDF5E6]/20 text-[8px] font-black uppercase font-heading tracking-widest">IDENTITY</p>
                                      <p className="text-[#FDF5E6] text-xl font-black uppercase font-heading tracking-tighter underline decoration-[#D4AF37]/40 underline-offset-4">{form.displayName}</p>
                                   </div>
                                   <div className="space-y-1">
                                      <p className="text-[#FDF5E6]/20 text-[8px] font-black uppercase font-heading tracking-widest">SIGNIFIER (ROLL)</p>
                                      <p className="text-[#FDF5E6] text-xl font-black uppercase font-heading tracking-tighter underline decoration-[#D4AF37]/40 underline-offset-4">{form.rollNo}</p>
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <div className="space-y-1">
                                      <p className="text-[#FDF5E6]/20 text-[8px] font-black uppercase font-heading tracking-widest">COMMUNICATION</p>
                                      <p className="text-[#FDF5E6] text-xl font-black uppercase font-heading tracking-tighter underline decoration-[#D4AF37]/40 underline-offset-4">{form.phoneNumber}</p>
                                   </div>
                                   <div className="flex items-center gap-3 text-green-500">
                                      <Sparkles className="w-5 h-5" />
                                      <p className="text-[10px] font-black uppercase font-heading tracking-widest">{isFormValid ? "LINEAGE CONFIRMED" : "PENDING FIELD VALIDATION"}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                          {!isFormValid && (
                            <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-2xl">
                              <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] font-heading">
                                ALL FIELDS MUST BE FILLED CORRECTLY BEFORE THE PASS CAN BE MINTED.
                              </p>
                            </div>
                          )}
                       </div>
                    )}
                  </div>

                  {statusMessage.text && (
                    <div className={cn(
                      "border rounded-2xl px-6 py-4",
                      statusMessage.type === "error"
                        ? "bg-red-600/10 border-red-600/20 text-red-500"
                        : "bg-green-600/10 border-green-600/20 text-green-500"
                    )}>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] font-heading">
                        {statusMessage.text}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6">
                     {activeStep > 0 && (
                        <button 
                          onClick={handleBack}
                          disabled={loading}
                          className="flex-1 py-10 border-2 border-white/10 text-white/40 font-black uppercase tracking-[0.5em] text-[10px] hover:border-white/40 hover:text-white transition-all font-heading"
                        >
                          PROTOCOL PREVIOUS
                        </button>
                     )}
                     <button 
                       onClick={activeStep === steps.length - 1 ? handleFinalize : handleNext}
                       disabled={loading || uploadingImage || (!isCurrentStepValid && activeStep < steps.length - 1) || (activeStep === steps.length - 1 && !isFormValid)}
                       className={cn(
                         "flex-3 py-10 text-[#1A0505] font-black uppercase tracking-[0.4em] text-xs transition-all font-heading relative group overflow-hidden",
                         loading || uploadingImage || (!isCurrentStepValid && activeStep < steps.length - 1) || (activeStep === steps.length - 1 && !isFormValid)
                           ? "bg-linear-to-r from-[#6B5A22] via-[#8A7530] to-[#6B5A22] opacity-60 cursor-not-allowed"
                           : "bg-linear-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:tracking-[0.6em]"
                       )}
                     >
                       <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
                       {loading || uploadingImage ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 
                          (activeStep === steps.length - 1 ? "FINALIZE & MINT PASS" : "EXECUTE NEXT STEP")}
                     </button>
                  </div>
                </motion.div>
              </AnimatePresence>
           </div>
        </div>

        <div className="mt-20 text-center opacity-30">
           <NextImage src="/assets/logo.png" alt="Bitotsav" width={40} height={40} className="mx-auto grayscale mb-4" />
           <p className="text-[8px] font-black uppercase tracking-[0.8em] text-[#FDF5E6] font-heading">BITOTSAV MMXXVI // HERITAGE PROTOCOL</p>
        </div>
      </div>
    </PageWrapper>
  );
}
