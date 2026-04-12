import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onUpload, 
  multiple = false, 
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png' 
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
    if (onUpload) onUpload(newFiles);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div>
      <div
        className={`glass-card ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderColor: dragActive ? 'var(--primary)' : 'var(--border)',
          background: dragActive ? 'rgba(99, 102, 241, 0.05)' : undefined
        }}
      >
        <FiUploadCloud size={40} color="var(--primary-light)" />
        <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>
          Drag & drop files here or <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>browse</span>
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
          Supports PDF, DOC, DOCX, JPG, PNG (Max 10MB)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((file, i) => (
            <div key={i} style={{ 
              display: 'flex', alignItems: 'center', gap: 12, 
              padding: '10px 16px', background: 'var(--bg-glass)', 
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' 
            }}>
              <FiFile color="var(--primary-light)" />
              <span style={{ flex: 1, fontSize: '0.85rem' }}>{file.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
