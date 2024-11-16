import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const addressSchema = z.object({
  department: z
    .string({
      required_error: "Seleccione un Departamento",
      invalid_type_error: "Seleccione un Departamento",
    })
    .min(1, "El departamento es requerido"),
  province: z
    .string({
      required_error: "Seleccione una Provincia",
      invalid_type_error: "Seleccione una Provincia",
    })
    .min(1, "La provincia es requerida"),
  district: z
    .string({
      required_error: "Seleccione un Distrito",
      invalid_type_error: "Seleccione un Distrito",
    })
    .min(1, "El distrito es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
});
export const PersonRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "El nombre es requerido")
      .max(255, "El nombre no puede tener más de 255 caracteres"),
    profession: z
      .string({
        required_error: "La profesión es requerida",
        invalid_type_error: "La profesión es requerida",
      })
      .min(1, "La profesión es requerida"),
    email: z.string().email("El email no es válido"),
    phoneNumber: z
      .string()
      .regex(/^\d{9}$/, "El número debe contener solo 9 dígitos"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/\d/, "La contraseña debe contener al menos un número"),
    passwordConfirm: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/\d/, "La contraseña debe contener al menos un número"),
    workForCompany: z.string().nullable(),
    termsAccepted: z
      .boolean({
        required_error: "Debes aceptar los términos y condiciones",
        invalid_type_error: "Debes aceptar los términos y condiciones",
      })
      .refine((value) => value === true, {
        message: "Debes aceptar los términos y condiciones",
      }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });

export const PersonUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede tener más de 255 caracteres"),
  profession_id: z
    .number({
      required_error: "La profesión es requerida",
      invalid_type_error: "La profesión es requerida",
    })
    .positive("La profesión es requerida"),
  email: z.string().email("El email no es válido"),

  image: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  workForCompany: z.string().nullable(),
});

export const CompanyRegisterSchema = z.object({
  // person
  logo: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  fullName: z
    .string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede tener más de 255 caracteres"),
  // password: z
  //   .string()
  //   .nullable(),
  // passwordConfirm: z
  //   .string()
  //   .min(8, "La contraseña debe tener al menos 8 caracteres")
  //   .regex(/\d/, "La contraseña debe contener al menos un número"),
  // company
  company: z
    .string()
    .min(1, "El nombre de la empresa es requerido")
    .max(255, "El nombre de la empresa no puede tener más de 255 caracteres"),
  ruc: z
    .string()
    // .regex(/^\d{11}$/, "El RUC debe contener solo 11 dígitos"),
    .nullable(),
  phone: z
    .string()
    // .regex(/^\d{9}$/, "El número debe contener solo 9 dígitos")
    .nullable(),
  email: z.string().email("El email no es válido"),
  businessFieldId: z
    .string({
      required_error: "El rubro es requerido",
      invalid_type_error: "El rubro es requerido",
    })
    .min(1, "El rubro es requerido"),

  // termsAccepted: z
  //   .boolean({
  //     required_error: "Debes aceptar los términos y condiciones",
  //     invalid_type_error: "Debes aceptar los términos y condiciones",
  //   })
  //   .refine((value) => value === true, {
  //     message: "Debes aceptar los términos y condiciones",
  //   }),
});
// .refine((data) => data.password === data.passwordConfirm, {
//   message: "Las contraseñas no coinciden",
//   path: ["passwordConfirm"],
// });
export const CompanyUpdateSchema = z.object({
  // person
  fullName: z
    .string()
    .min(1, "El nombre del encargado es requerido")
    .max(255, "El nombre del encargado no puede tener más de 255 caracteres"),
  // company
  company: z
    .string()
    .min(1, "El nombre de la empresa es requerido")
    .max(255, "El nombre de la empresa no puede tener más de 255 caracteres"),
  ruc: z.string().regex(/^\d{11}$/, "El RUC debe contener solo 11 dígitos"),
  phoneNumber: z
    .string()
    // .regex(/^\d{9}$/, "El número debe contener solo 9 dígitos"),
    .nullable(),
  description: z
    .string()
    .min(1, "La descripcion es requerida")
    .max(255, "La descripcion no puede tener más de 255 caracteres"),
  website: z.string().nullable(),
  email: z.string().email("El email no es válido"),
  businessFieldId: z
    .number({
      required_error: "La profesión es requerida",
      invalid_type_error: "La profesión es requerida",
    })
    .positive("La profesión es requerida"),
  businessHours: z.string().nullable(),
  // .min(1, "El horario de atención es requerido")
  // .max(255, "El horario de atención no puede tener más de 255 caracteres"),
  // logo: z.any().nullable(),
  logo: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  branchesInfo: z
    .array(
      z.object({
        address: z.string().min(1, "La dirección es requerida"),
        department: z.string().min(1, "El departamento es requerido"),
        province: z.string().min(1, "La provincia es requerida"),
        district: z.string().min(1, "El distrito es requerido"),
        name: z.string().min(1, "El nombre del encargado es requerido"),
        rol: z.string().min(1, "El rol es requerido"),
        phone: z.string().nullable(),
        email: z.string().nullable(),
      })
    )
    .nullable(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("El email no es válido"),
});

export const ResetPasswordSchema = z
  .object({
    code: z
      .string()
      .max(4, "El código debe tener 4 dígitos")
      .min(4, "El código debe tener 4 dígitos"),

    email: z.string().email("El email no es válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/\d/, "La contraseña debe contener al menos un número"),
    passwordConfirm: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/\d/, "La contraseña debe contener al menos un número"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });

export const PersonProfileSchema = z.object({
  fullName: z.string(),
  description: z.string(),
  phone_number: z.string().min(9),
  email: z.string().email(),
  professionId: z.string(),
});

export const CompanyProfileSchema = z.object({
  fullName: z.string(),
  description: z.string(),
  ruc: z.string().min(11),
  phone: z.string().min(9),
  email: z.string().email(),
  rubro: z.string(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña es requerida"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/\d/, "La contraseña debe contener al menos un número"),
    passwordConfirm: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/\d/, "La contraseña debe contener al menos un número"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordConfirm"],
  });

export const registerSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("El correo no es valido"),
    // numero: z.string().nullable(),
    profession: z.string().min(1, "La profesion es requerida"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
    content: z.string().min(1, "El tipo del contenido es requerido"),
    company: z.string().min(1, "El nombre de la empresa es requerido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const publisherSchema = z.object({
  profile: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("El correo no es valido"),
  phone: z.string().nullable(),
  profesion: z.string().min(1, "La profesion es requerida"),
  company: z.string().min(1, "El nombre de la empresa es requerido"),
});

export const publisherPermisses = z.object({
  content: z.array(z.string()),
});
