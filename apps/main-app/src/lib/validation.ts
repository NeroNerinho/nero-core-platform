import { z } from "zod"

// CPF Validation Algorithm
function validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '')
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false
    const cpfArray = cpf.split('').map(el => +el)
    const rest = (count: number) => (cpfArray.slice(0, count - 12).reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10
    return rest(10) === cpfArray[9] && rest(11) === cpfArray[10]
}

// CNPJ Validation Algorithm
function validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '')
    if (cnpj.length !== 14) return false

    // Validate Check Digits
    let size = cnpj.length - 2
    let numbers = cnpj.substring(0, size)
    const digits = cnpj.substring(size)
    let sum = 0
    let pos = size - 7

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--
        if (pos < 2) pos = 9
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11
    if (result !== parseInt(digits.charAt(0))) return false

    size = size + 1
    numbers = cnpj.substring(0, size)
    sum = 0
    pos = size - 7
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--
        if (pos < 2) pos = 9
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11
    return result === parseInt(digits.charAt(1))
}

// Formatting Utilities
export const formatCNPJ = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18)
}

export const formatCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14)
}

// Zod Schemas
export const cpfSchema = z.string().refine(validateCPF, {
    message: "CPF inválido",
})

export const cnpjSchema = z.string().refine(validateCNPJ, {
    message: "CNPJ inválido",
})

export const emailSchema = z.string().email({
    message: "E-mail inválido",
})

export const passwordSchema = z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres",
})

export const LoginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export const SupplierSearchSchema = z.object({
    pi: z.string().min(1, "Número do PI é obrigatório"),
    cnpj: cnpjSchema,
})
