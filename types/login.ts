export interface  FormProps{
    onSubmit: (formData: FormData) => Promise<void>
    onClearError: () => void
    loading: boolean
    error: string
}