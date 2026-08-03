// import { useEffect, useRef, useState } from 'react'
// import { Controller, useFormContext } from 'react-hook-form'
// import { Download, ExternalLink, Eye, FileText, UploadCloud, X } from 'lucide-react'
// import clsx from 'clsx'

// import type { FieldError } from 'react-hook-form'
// import type { FileUploadInputProps, FileUploadValue } from '@/shared/types/index'

// const formatBytes = (bytes: number) => {
//   if (!bytes) return '0 KB'
//   const units = ['B', 'KB', 'MB', 'GB']
//   const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
//   const value = bytes / 1024 ** index
//   return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
// }

// const normalizeValue = (value: FileUploadValue | File | null | undefined): FileUploadValue | null => {
//   if (!value) return null

//   if (value instanceof File) {
//     return {
//       name: value.name,
//       size: value.size,
//       type: value.type,
//       uri: URL.createObjectURL(value),
//       file: value,
//     }
//   }

//   if (typeof value === 'object' && 'name' in value) {
//     const fileValue = value as FileUploadValue
//     return {
//       name: fileValue.name ?? 'Uploaded file',
//       size: fileValue.size ?? 0,
//       type: fileValue.type ?? '',
//       uri: fileValue.uri ?? '',
//       file: fileValue.file ?? new File([], fileValue.name ?? 'uploaded-file'),
//     }
//   }

//   return null
// }

// const isImageType = (type: string) => /image\/(png|jpe?g|gif|webp|bmp)/i.test(type)

// export default function FileUploadInput({
//   name,
//   label = 'Upload file',
//   required = false,
//   optional = false,
//   accept,
//   maxSizeInMB = 10,
//   placeholder = 'Click to browse or drag a file here',
//   helperText,
//   disabled = false,
//   error,
//   className,
//   value,
//   onChange,
// }: FileUploadInputProps) {
//   const form = useFormContext()
//   const inputRef = useRef<HTMLInputElement>(null)
//   const [dragActive, setDragActive] = useState(false)
//   const [validationMessage, setValidationMessage] = useState<string | null>(null)
//   const [localValue, setLocalValue] = useState<FileUploadValue | null>(normalizeValue(value ?? null))
//   const [previewFile, setPreviewFile] = useState<FileUploadValue | null>(null)

//   useEffect(() => {
//     setLocalValue(normalizeValue(value ?? null))
//   }, [value])

//   useEffect(() => {
//     if (!previewFile) return

//     const onKeyDown = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') setPreviewFile(null)
//     }

//     window.addEventListener('keydown', onKeyDown)
//     return () => window.removeEventListener('keydown', onKeyDown)
//   }, [previewFile])

//   const buildValue = (file: File): FileUploadValue => ({
//     name: file.name,
//     size: file.size,
//     type: file.type,
//     uri: URL.createObjectURL(file),
//     file,
//   })

//   const handleValueChange = (nextValue: FileUploadValue | null, fieldChange?: (value: File | null) => void) => {
//     setValidationMessage(null)
//     setLocalValue(nextValue)
//     fieldChange?.(nextValue)
//     onChange?.(nextValue)
//   }

//   const handleFileSelection = (
//     file: File | null,
//     fieldChange?: (value: File | null) => void,
//   ) => {
//     if (!file) return

//     if (maxSizeInMB && file.size > maxSizeInMB * 1024 * 1024) {
//       setValidationMessage(`File must be smaller than ${maxSizeInMB}MB.`)
//       return
//     }

//     const nextValue = buildValue(file)
//     handleValueChange(nextValue, fieldChange)
//   }

//   const clearSelection = (fieldChange?: (value: File | null) => void) => {
//     handleValueChange(null, fieldChange)
//   }

//   const previewKind = (file: FileUploadValue | null) => {
//     if (!file) return 'none'

//     const cleanType = file.type.toLowerCase()
//     const cleanName = file.name.toLowerCase()

//     if (cleanType.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(cleanName)) return 'image'
//     if (cleanType === 'application/pdf' || /\.pdf$/i.test(cleanName)) return 'pdf'
//     return 'document'
//   }

//   const renderUploadArea = (
//     selectedValue: FileUploadValue | null,
//     fieldChange?: (value: File | null) => void,
//     fieldError?: FieldError | string,
//   ) => {
//     const fieldErrorMessage = typeof fieldError === 'string' ? fieldError : fieldError?.message
//     const propErrorMessage = typeof error === 'string' ? error : error?.message
//     const currentError = validationMessage ?? fieldErrorMessage ?? propErrorMessage
//     const hasError = Boolean(currentError)

//     return (
//       <div className={clsx('w-full', className)}>
//         {label && (
//           <div className="mb-2 flex items-center">
//             <label className="text-sm font-medium text-[var(--color-text)]">
//               {label}
//             </label>
//             {!optional && required && <span className="ml-1 text-red-500">*</span>}
//           </div>
//         )}

//         <div
//           className={clsx(
//             'relative overflow-hidden rounded-2xl border border-dashed px-4 py-4 transition-all duration-200',
//             hasError
//               ? 'border-[var(--color-danger)] bg-red-50/70'
//               : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-400)] hover:bg-white',
//             dragActive && 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)]',
//             disabled && 'cursor-not-allowed opacity-60',
//           )}
//           onDragOver={(event) => {
//             event.preventDefault()
//             if (!disabled) setDragActive(true)
//           }}
//           onDragLeave={() => setDragActive(false)}
//           onDrop={(event) => {
//             event.preventDefault()
//             setDragActive(false)
//             if (disabled) return
//             const file = event.dataTransfer.files?.[0] ?? null
//             handleFileSelection(file, fieldChange)
//           }}
//         >
//           <input
//             ref={inputRef}
//             type="file"
//             accept={accept}
//             className="hidden"
//             disabled={disabled}
//             onChange={(event) => {
//               const file = event.target.files?.[0] ?? null
//               handleFileSelection(file, fieldChange)
//               event.target.value = ''
//             }}
//           />

//           {selectedValue ? (
//             <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm">
//               <button
//                 type="button"
//                 onClick={() => setPreviewFile(selectedValue)}
//                 className="flex min-w-0 flex-1 items-center gap-3 text-left"
//               >
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[var(--color-primary-600)]">
//                   {isImageType(selectedValue.type) && selectedValue.uri ? (
//                     <img src={selectedValue.uri} alt={selectedValue.name} className="h-11 w-11 rounded-xl object-cover" />
//                   ) : (
//                     <FileText size={18} />
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <p className="truncate text-sm font-semibold text-[var(--color-text)]">{selectedValue.name}</p>
//                   <p className="text-xs text-[var(--color-text-muted)]">{formatBytes(selectedValue.size)}</p>
//                 </div>
//               </button>

//               <div className="flex shrink-0 items-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setPreviewFile(selectedValue)}
//                   disabled={disabled}
//                   className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)]"
//                   aria-label="Preview file"
//                 >
//                   <Eye size={16} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => inputRef.current?.click()}
//                   disabled={disabled}
//                   className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)]"
//                   aria-label="Replace file"
//                 >
//                   <UploadCloud size={16} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => clearSelection(fieldChange)}
//                   disabled={disabled}
//                   className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-red-200 hover:text-red-600"
//                   aria-label="Remove file"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <button
//               type="button"
//               disabled={disabled}
//               onClick={() => inputRef.current?.click()}
//               className="flex w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-transparent text-left"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
//                   <UploadCloud size={18} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-[var(--color-text)]">{placeholder}</p>
//                   <p className="text-xs text-[var(--color-text-muted)]">
//                     {helperText ?? (accept ? `Accepted formats: ${accept}` : 'PNG, JPG, PDF, DOCX and more')}
//                   </p>
//                 </div>
//               </div>
//               <div className="rounded-full border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
//                 Browse
//               </div>
//             </button>
//           )}
//         </div>

//         <p className="mt-1.5 min-h-[16px] text-xs text-[var(--color-danger)]">
//           {currentError ?? ''}
//         </p>

//         {previewFile && (
//           <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
//             <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
//               <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
//                 <div className="min-w-0">
//                   <p className="truncate text-sm font-semibold text-slate-900">{previewFile.name}</p>
//                   <p className="text-xs text-slate-500">{formatBytes(previewFile.size)}</p>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <a
//                     href={previewFile.uri}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//                   >
//                     <ExternalLink size={14} /> Open
//                   </a>
//                   <a
//                     href={previewFile.uri}
//                     download={previewFile.name}
//                     className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//                   >
//                     <Download size={14} /> Download
//                   </a>
//                   <button
//                     type="button"
//                     onClick={() => setPreviewFile(null)}
//                     className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
//                     aria-label="Close preview"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               </div>

//               <div className="max-h-[78vh] overflow-auto bg-slate-50 p-4">
//                 {previewKind(previewFile) === 'image' ? (
//                   <img src={previewFile.uri} alt={previewFile.name} className="mx-auto max-h-[70vh] w-full rounded-2xl object-contain" />
//                 ) : previewKind(previewFile) === 'pdf' ? (
//                   <iframe src={previewFile.uri} title={previewFile.name} className="h-[70vh] w-full rounded-2xl border border-slate-200 bg-white" />
//                 ) : (
//                   <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
//                     <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
//                       <FileText size={28} />
//                     </div>
//                     <h3 className="text-lg font-semibold text-slate-900">Preview for this file type is not rendered directly in the browser.</h3>
//                     <p className="mt-2 max-w-md text-sm text-slate-500">
//                       This file can still be opened in a new tab or downloaded for review.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (name && form?.control) {
//     return (
//       <Controller
//         control={form.control}
//         name={name}
//         defaultValue={null}
//         render={({ field, fieldState }) => renderUploadArea(normalizeValue(field.value as FileUploadValue | File | null), field.onChange, fieldState.error?.message)}
//       />
//     )
//   }

//   return renderUploadArea(localValue, (nextValue) => {
//     if (value === undefined) {
//       handleValueChange(nextValue)
//     }
//   })
// }
import { useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Download, ExternalLink, Eye, FileText, UploadCloud, X } from 'lucide-react'
import clsx from 'clsx'

import type { FieldError } from 'react-hook-form'
import type { FileUploadInputProps, FileUploadValue } from '@/shared/types/index'

const formatBytes = (bytes: number) => {
  if (!bytes) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

const normalizeValue = (value: FileUploadValue | File | null | undefined): FileUploadValue | null => {
  if (!value) return null

  if (value instanceof File) {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
      uri: URL.createObjectURL(value),
      file: value,
    }
  }

  if (typeof value === 'object' && 'name' in value) {
    const fileValue = value as FileUploadValue
    return {
      name: fileValue.name ?? 'Uploaded file',
      size: fileValue.size ?? 0,
      type: fileValue.type ?? '',
      uri: fileValue.uri ?? '',
      file: fileValue.file ?? new File([], fileValue.name ?? 'uploaded-file'),
    }
  }

  return null
}

const isImageType = (type: string) => /image\/(png|jpe?g|gif|webp|bmp)/i.test(type)

export default function FileUploadInput({
  name,
  label = 'Upload file',
  required = false,
  optional = false,
  accept,
  maxSizeInMB = 10,
  placeholder = 'Click to browse or drag a file here',
  helperText,
  disabled = false,
  error,
  className,
  value,
  onChange,
}: FileUploadInputProps) {
  const form = useFormContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [localValue, setLocalValue] = useState<FileUploadValue | null>(normalizeValue(value ?? null))
  const [previewFile, setPreviewFile] = useState<FileUploadValue | null>(null)

  useEffect(() => {
    setLocalValue(normalizeValue(value ?? null))
  }, [value])

  useEffect(() => {
    if (!previewFile) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewFile(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewFile])

  const buildValue = (file: File): FileUploadValue => ({
    name: file.name,
    size: file.size,
    type: file.type,
    uri: URL.createObjectURL(file),
    file,
  })

  const handleValueChange = (nextValue: FileUploadValue | null, fieldChange?: (value: File | null) => void) => {
    setValidationMessage(null)
    setLocalValue(nextValue)
    fieldChange?.(nextValue?.file ?? null)
    onChange?.(nextValue)
  }

 const handleFileSelection = (
  file: File | null,
  fieldChange?: (value: File | null) => void,
) => {
  if (!file) {
    fieldChange?.(null);
    return;
  }

  if (maxSizeInMB && file.size > maxSizeInMB * 1024 * 1024) {
    setValidationMessage(`File must be smaller than ${maxSizeInMB}MB.`);
    return;
  }

  fieldChange?.(file);
};

  const clearSelection = (fieldChange?: (value: File | null) => void) => {
    handleValueChange(null, fieldChange)
  }

  const previewKind = (file: FileUploadValue | null) => {
    if (!file) return 'none'

    const cleanType = file.type.toLowerCase()
    const cleanName = file.name.toLowerCase()

    if (cleanType.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp)$/i.test(cleanName)) return 'image'
    if (cleanType === 'application/pdf' || /\.pdf$/i.test(cleanName)) return 'pdf'
    return 'document'
  }

  const renderUploadArea = (
    selectedValue: FileUploadValue | null,
    fieldChange?: (value: File | null) => void,
    fieldError?: FieldError | string,
  ) => {
    const fieldErrorMessage = typeof fieldError === 'string' ? fieldError : fieldError?.message
    const propErrorMessage = typeof error === 'string' ? error : error?.message
    const currentError = validationMessage ?? fieldErrorMessage ?? propErrorMessage
    const hasError = Boolean(currentError)

    return (
      <div className={clsx('w-full', className)}>
        {label && (
          <div className="mb-2 flex items-center">
            <label className="text-sm font-medium text-[var(--color-text)]">
              {label}
            </label>
            {!optional && required && <span className="ml-1 text-red-500">*</span>}
          </div>
        )}

        <div
          className={clsx(
            'relative overflow-hidden rounded-2xl border border-dashed px-4 py-4 transition-all duration-200',
            hasError
              ? 'border-[var(--color-danger)] bg-red-50/70'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-400)] hover:bg-white',
            dragActive && 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)]',
            disabled && 'cursor-not-allowed opacity-60',
          )}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled) setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragActive(false)
            if (disabled) return
            const file = event.dataTransfer.files?.[0] ?? null
            handleFileSelection(file, fieldChange)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null
              handleFileSelection(file, fieldChange)
              event.target.value = ''
            }}
          />

          {selectedValue ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm">
              <button
                type="button"
                onClick={() => setPreviewFile(selectedValue)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[var(--color-primary-600)]">
                  {isImageType(selectedValue.type) && selectedValue.uri ? (
                    <img src={selectedValue.uri} alt={selectedValue.name} className="h-11 w-11 rounded-xl object-cover" />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--color-text)]">{selectedValue.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{formatBytes(selectedValue.size)}</p>
                </div>
              </button>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewFile(selectedValue)}
                  disabled={disabled}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)]"
                  aria-label="Preview file"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  disabled={disabled}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-[var(--color-primary-400)] hover:text-[var(--color-primary-600)]"
                  aria-label="Replace file"
                >
                  <UploadCloud size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => clearSelection(fieldChange)}
                  disabled={disabled}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-red-200 hover:text-red-600"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-transparent text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary-600)]">
                  <UploadCloud size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{placeholder}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {helperText ?? (accept ? `Accepted formats: ${accept}` : 'PNG, JPG, PDF, DOCX and more')}
                  </p>
                </div>
              </div>
              <div className="rounded-full border border-[var(--color-primary-100)] bg-[var(--color-primary-50)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
                Browse
              </div>
            </button>
          )}
        </div>

        <p className="mt-1.5 min-h-[16px] text-xs text-[var(--color-danger)]">
          {currentError ?? ''}
        </p>

        {previewFile && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
            <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{previewFile.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(previewFile.size)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={previewFile.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <ExternalLink size={14} /> Open
                  </a>
                  <a
                    href={previewFile.uri}
                    download={previewFile.name}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Download size={14} /> Download
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewFile(null)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                    aria-label="Close preview"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="max-h-[78vh] overflow-auto bg-slate-50 p-4">
                {previewKind(previewFile) === 'image' ? (
                  <img src={previewFile.uri} alt={previewFile.name} className="mx-auto max-h-[70vh] w-full rounded-2xl object-contain" />
                ) : previewKind(previewFile) === 'pdf' ? (
                  <iframe src={previewFile.uri} title={previewFile.name} className="h-[70vh] w-full rounded-2xl border border-slate-200 bg-white" />
                ) : (
                  <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                      <FileText size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Preview for this file type is not rendered directly in the browser.</h3>
                    <p className="mt-2 max-w-md text-sm text-slate-500">
                      This file can still be opened in a new tab or downloaded for review.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (name && form?.control) {
    return (
      <Controller
        control={form.control}
        name={name}
        defaultValue={null}
        render={({ field, fieldState }) => renderUploadArea(normalizeValue(field.value as FileUploadValue | File | null), field.onChange, fieldState.error?.message)}
      />
    )
  }

  return renderUploadArea(localValue, (nextValue) => {
    if (value === undefined) {
      handleValueChange(nextValue)
    }
  })
}
