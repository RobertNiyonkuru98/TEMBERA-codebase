import { useCallback, useState } from "react";
import { Upload, X, FileText, File as FileIcon } from "lucide-react";

interface UploadedDocument {
  url: string;
  publicId: string;
  file?: File;
  name?: string;
}

interface DocumentUploadProps {
  documents: UploadedDocument[];
  onDocumentsChange: (documents: UploadedDocument[]) => void;
  maxDocuments?: number;
  disabled?: boolean;
  acceptedTypes?: string;
}

export function DocumentUpload({
  documents,
  onDocumentsChange,
  maxDocuments = 5,
  disabled = false,
  acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.txt",
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const newDocuments: UploadedDocument[] = [];
      const remainingSlots = maxDocuments - documents.length;

      for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
        const file = files[i];
        newDocuments.push({
          url: URL.createObjectURL(file),
          publicId: `temp-${Date.now()}-${i}`,
          file,
          name: file.name,
        });
      }

      if (newDocuments.length > 0) {
        onDocumentsChange([...documents, ...newDocuments]);
      }
    },
    [documents, maxDocuments, onDocumentsChange, disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(newDocuments);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (ext === 'doc' || ext === 'docx') return <FileIcon className="h-5 w-5 text-blue-500" />;
    if (ext === 'xls' || ext === 'xlsx') return <FileIcon className="h-5 w-5 text-green-500" />;
    return <FileIcon className="h-5 w-5 text-slate-500" />;
  };

  return (
    <div className="space-y-3">
      {documents.length < maxDocuments && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-slate-300 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <input
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
            <Upload className="h-8 w-8 text-slate-400" />
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Click to upload
              </span>{" "}
              or drag and drop
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              PDF, Word, Excel files (max {maxDocuments})
            </p>
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="grid gap-2">
          {documents.map((doc, index) => (
            <div
              key={doc.publicId}
              className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
            >
              {getFileIcon(doc.name || '')}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                  {doc.name || 'Document'}
                </p>
                {doc.file && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(doc.file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
