import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "primary";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false,
}: ConfirmationModalProps) {
  
  const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
  };

  const IconMap = {
    danger: <AlertCircle className="h-6 w-6 text-red-500" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    info: <Info className="h-6 w-6 text-blue-500" />,
    primary: <Info className="h-6 w-6 text-emerald-500" />,
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <DialogHeader className="flex flex-col items-center sm:items-start sm:flex-row gap-4 mb-2">
          <div className={cn(
            "p-2 rounded-full shrink-0",
            variant === 'danger' && "bg-red-100 dark:bg-red-500/10",
            variant === 'warning' && "bg-amber-100 dark:bg-amber-500/10",
            variant === 'info' && "bg-blue-100 dark:bg-blue-500/10",
            variant === 'primary' && "bg-emerald-100 dark:bg-emerald-500/10",
          )}>
            {IconMap[variant]}
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading} 
            className="border-slate-200 dark:border-slate-800"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading} 
            className={variantStyles[variant]}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
