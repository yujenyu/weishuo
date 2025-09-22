'use client';

import type { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  LinearProgress,
  Typography,
  FormControl,
  FormLabel,
  FormHelperText,
  Stack,
} from '@mui/material';
import type { CreateForm } from '../types';

export default function CreateResourceDialog({
  open,
  onClose,
  form,
  setForm,
  showErrors,
  fieldErrors,
  creating,
  isSubmitDisabled,
  onSubmit,
  title,
  uploading,
  uploadErr,
  handleFileChange,
}: {
  open: boolean;
  onClose: () => void;
  form: CreateForm;
  setForm: Dispatch<SetStateAction<CreateForm>>;
  showErrors: boolean;
  fieldErrors: Record<string, string>;
  creating: boolean;
  isSubmitDisabled: boolean;
  onSubmit: () => Promise<void> | void;
  title: string;
  uploading: boolean;
  uploadErr: string | null;
  handleFileChange: (file?: File | null) => Promise<void>;
}) {
  const isDialogLocked = creating || uploading;

  return (
    <Dialog
      open={open}
      onClose={() => !isDialogLocked && onClose()}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <TextField
          label="標題"
          required
          fullWidth
          margin="normal"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          error={showErrors && !!fieldErrors.title}
          helperText={showErrors ? fieldErrors.title : ''}
        />
        <TextField
          label="描述"
          required
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          error={showErrors && !!fieldErrors.description}
          helperText={showErrors ? fieldErrors.description : ''}
        />
        <TextField
          label="內容"
          required
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          error={showErrors && !!fieldErrors.content}
          helperText={showErrors ? fieldErrors.content : ''}
        />
        {/* <TextField
          label="圖片 URL"
          required
          fullWidth
          margin="normal"
          placeholder="https://..."
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          error={showErrors && !!fieldErrors.imageUrl}
          helperText={showErrors ? fieldErrors.imageUrl : ''}
        /> */}
        <FormControl
          fullWidth
          margin="normal"
          required
          error={!!uploadErr || (showErrors && !!fieldErrors.imageUrl)}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              component="label"
              disabled={isDialogLocked}
            >
              選擇圖片
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
            </Button>

            {/* 顯示上傳中 */}
            {uploading && <LinearProgress sx={{ flex: 1 }} />}
          </Stack>

          {/* 預覽 */}
          {form.imageUrl && !uploading && (
            <img
              src={form.imageUrl}
              alt="預覽"
              style={{
                width: '100%',
                maxHeight: 220,
                objectFit: 'cover',
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}

          <FormHelperText>
            {uploadErr || (showErrors ? fieldErrors.imageUrl : '')}
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={creating}>
          取消
        </Button>
        <Button
          variant="contained"
          disabled={isSubmitDisabled}
          onClick={onSubmit}
        >
          {creating ? '建立中...' : '建立'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
