import { UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import { externalItemCategoryOptions, type ExternalItemCategory } from '@/features/venado-money/types'

interface ExternalItemFieldsProps {
  name: string
  onNameChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  category: ExternalItemCategory | ''
  onCategoryChange: (value: ExternalItemCategory | '') => void
  externalCode: string
  onExternalCodeChange: (value: string) => void
  imageUrl: string
  onImageUrlChange: (value: string) => void
}

export function ExternalItemFields({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  category,
  onCategoryChange,
  externalCode,
  onExternalCodeChange,
  imageUrl,
  onImageUrlChange,
}: ExternalItemFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageName, setImageName] = useState('')

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel>Nombre del ítem *</FieldLabel>
        <Input placeholder='Ej: Televisor Samsung 55"' value={name} onChange={(e) => onNameChange(e.target.value)} />
      </Field>

      <Field>
        <FieldLabel>Descripción</FieldLabel>
        <Textarea placeholder="Detalles del ítem..." value={description} onChange={(e) => onDescriptionChange(e.target.value)} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Categoría *</FieldLabel>
          <NativeSelect value={category} onChange={(e) => onCategoryChange(e.target.value as ExternalItemCategory | '')}>
            <NativeSelectOption value="">Seleccionar...</NativeSelectOption>
            {externalItemCategoryOptions.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel>Código externo (Opcional)</FieldLabel>
          <Input placeholder="SKU o ID externo" value={externalCode} onChange={(e) => onExternalCodeChange(e.target.value)} />
        </Field>
      </div>

      <Field>
        <FieldLabel>Imagen del ítem</FieldLabel>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            setImageName(file.name)
            onImageUrlChange(URL.createObjectURL(file))
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/40"
        >
          {imageUrl ? (
            <img src={imageUrl} alt={imageName} className="h-20 rounded-md object-cover" />
          ) : (
            <UploadCloud size={22} className="text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-foreground">{imageName || 'Haz clic para subir o arrastra la imagen aquí'}</span>
          <span className="text-xs text-muted-foreground">Formatos soportados: JPG, PNG, WEBP (Max 5MB)</span>
        </button>
        {imageUrl && (
          <button
            type="button"
            className="flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            onClick={() => {
              setImageName('')
              onImageUrlChange('')
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          >
            <X size={12} />
            Quitar imagen
          </button>
        )}
      </Field>
    </div>
  )
}
