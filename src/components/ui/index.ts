/**
 * UI Components Index
 *
 * Exports both shadcn/ui components and custom PEPE Dome components.
 */

// ===== shadcn/ui Base Components =====

// Button
export { Button, buttonVariants } from './Button'
export { default as ButtonDefault } from './Button'
export type { ButtonProps } from './Button'

// Card
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
} from './Card'
export { default as CardDefault } from './Card'
export type { CardProps } from './Card'

// Input
export { Input, inputVariants } from './Input'
export { default as InputDefault } from './Input'
export type { InputProps } from './Input'

// Label
export { Label, labelVariants } from './label'
export type { LabelProps } from './label'

// Textarea
export { Textarea, textareaVariants } from './textarea'
export type { TextareaProps } from './textarea'

// Badge
export { Badge, badgeVariants } from './badge'

// Skeleton
export { Skeleton } from './skeleton'

// Switch
export { Switch } from './switch'

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select'

// Dialog
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog'

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table'

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// Dropdown Menu
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './dropdown-menu'

// Popover
export { Popover, PopoverTrigger, PopoverContent } from './popover'

// Calendar
export { Calendar } from './calendar'

// Toast (Sonner)
export { Toaster } from './sonner'

// Form
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from './form'

// ===== Legacy EventCard and NewsCard (deprecated - use custom/ versions) =====
// Keeping for backward compatibility with existing pages
export { default as EventCard } from './EventCard'
export { default as NewsCard } from './NewsCard'
export type { EventCardProps } from './EventCard'
export type { NewsCardProps } from './NewsCard'
