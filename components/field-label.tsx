// components/ui/field-label.tsx
import { Label } from '@/components/ui/label'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FieldLabelProps {
  label: string
  required?: boolean
  description?: string
}

export function FieldLabel({
  label,
  required = false,
  description,
}: FieldLabelProps) {
  return (
    <div className='flex items-center gap-2'>
      <Label className='font-medium'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </Label>
      {description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type='button'>
              <Info className='h-4 w-4 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>
              <p className='max-w-xs'>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
