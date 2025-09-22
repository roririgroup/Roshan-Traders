const base = 'inline-flex border cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-[#F08344] text-white border-[#F08344] hover:bg-[#E07533] focus:ring-[#F08344]/50',
  outline: 'bg-transparent text-[#F08344] border-[#F08344] hover:bg-[#F08344] hover:text-white focus:ring-[#F08344]/50',
  secondary: 'bg-secondary text-secondary-foreground border-gray-200 hover:bg-secondary/80 focus:ring-ring',
  ghost: 'bg-transparent text-foreground border-transparent hover:bg-accent focus:ring-ring',
  danger: 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 focus:ring-ring',
}

export default function Button({ 
  variant = 'primary', 
  className = '', 
  children, 
  type = 'button', 
  ...props 
}) {
  const variantClass = variants[variant] || variants.primary
  const combined = `${base} ${variantClass} px-4 py-2 ${className}`.trim()
  
  return (
    <button type={type} className={combined} {...props}>
      {children}
    </button>
  )
}

// Usage examples:
// <Button onClick={onAddEmployee}>Add Employee</Button>
// <Button variant="outline" onClick={onAddEmployee}>Add Employee</Button>