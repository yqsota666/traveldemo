import { Button, Input, Message } from '@arco-design/web-react';
import { IconUpload } from '@arco-design/web-react/icon';
import { useRef, useState } from 'react';
import { api } from '../services/api';

interface ImageUrlInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function ImageUrlInput({ value, onChange, placeholder }: ImageUrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.cmsUpload(file);
      onChange?.(res.data.result.url);
      Message.success('图片已上传');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="image-url-field">
      <div className="image-url-control">
        <Input value={value} onChange={onChange} placeholder={placeholder || '上传后自动填入图片地址，也可手动粘贴'} />
        <Button loading={uploading} icon={<IconUpload />} onClick={() => inputRef.current?.click()}>
          上传
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={(event) => upload(event.target.files?.[0])}
      />
      {value ? <img className="image-url-preview" src={value} alt="preview" /> : null}
    </div>
  );
}
