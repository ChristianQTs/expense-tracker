type Variant = 'primary' | 'delete' | 'auth'
interface ButtonProps {
    children: String;
    onClick?: (e? : any) => void;
    styleType?: Variant;
    type?: "button" | "submit" | "reset";
    isDisabled?: boolean;
    title?:string
}
export const inputStyle = 'bg-white border border-blue-600 rounded-md px-0.5 py-0.2 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
export function Button({ children, onClick, styleType = 'primary',type='button', isDisabled=false, title }: ButtonProps) {
    const baseStyle = 'transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    const variants :Record<Variant, string> = {
        primary: 'px-3 py-0.5 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg',
        delete: 'px-1.5 py-0.1 rounded-md font-medium bg-red-600 text-gray-200 hover:bg-red-700 hover:text-white ',
        auth: 'px-4 h-[30px] rounded border border-gray-300 bg-gray-50 text-gray-700 font-normal hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm',

    }
    return (
        <button type={type} onClick={onClick} disabled={isDisabled} className={`${baseStyle} ${variants[styleType]}`} title={title}>
            {children}
        </button>
    )
}