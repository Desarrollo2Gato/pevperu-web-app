import { z } from "zod";

export const notificationSaveSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  type: z.object({
    id: z.number(),
    name: z.string(),
  }),
  destination: z.string().min(1, "El destino es requerido"),
});

// profession and business field
export const professionSaveSchema = z.object({
  name: z.string().min(1, "El nombre de la profesión es requerido"),
});

export const helpUpdateSchema = z.object({
  ws_link: z.string().min(1, "El link de whatsapp es requerido"),
  phone: z.string().regex(/^\d{9}$/, "El número debe contener solo 9 dígitos"),
  telephone: z
    .string()
    // .regex(/^\d{7}$/, "El número debe contener solo 7 dígitos"),
    .nullable(),
  email: z.string().email("El email no es válido"),
  emailSuscription: z.string().nullable(),
  emailCourse: z.string().nullable(),
  emailSupport: z.string().nullable(),
  address: z
    .string()
    .min(1, "La dirección es requerida")
    .max(255, "La dirección no puede tener más de 255 caracteres"),
  link_web: z.string().nullable(),
  link_admin_app: z.string().nullable(),
  fb_link: z.string().nullable(),
  ig_link: z.string().nullable(),
  lkdin_link: z.string().nullable(),
});

export const planSaveSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().nullable(),
  price: z
    .string()
    .min(1, "El precio anual es requerido")
    .regex(/^\d+(\.\d{1,2})?$/, "El precio anual no es válido"),
  num_features_products: z
    .string()
    .min(1, "El número de productos es requerido"),
  num_products: z
    .string()
    .regex(/^\d+$/, "El número de productos no es válido")
    .min(1, "El número de productos es requerido"),
  num_features_events: z
    .string()
    .regex(/^\d+$/, "El número de eventos no es válido")
    .min(1, "El número de eventos es requerido"),
  num_features_news: z
    .string()
    .regex(/^\d+$/, "El número de noticias no es válido")
    .min(1, "El número de noticias es requerido"),
  benefits: z.array(
    z.object({
      title: z.string().min(1, "El nombre es requerido"),
      description: z.string().min(1, "La descripción es requerida"),
    })
  ),
  banners_intern: z
    .string()
    .regex(/^\d+$/, "El número de banners internos no es válido")
    .nullable(),
  banners_product: z
    .string()
    .regex(/^\d+$/, "El número de banners internos no es válido")
    .nullable(),
});
export const subscriptionSaveSchema = z.object({
  companyId: z.string().min(1, "El usuario es requerido"),
  plan: z.string().min(1, "El plan es requerido"),
  startDate: z.coerce.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "La fecha de inicio no es válida",
  }),
  endDate: z.coerce.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "La fecha de inicio no es válida",
  }),
  status: z.string().min(1, "El estado es requerido"),
});

export const renewSubscriptionSchema = z.object({
  duration: z
    .string()
    .min(1, "La número de meses es requerido")
    .regex(/^\d+$/, "La duración debe ser el número de meses"),
});

export const eventSaveSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  type: z.string().min(1, "El tipo es requerido"),
  status: z.string().min(1, "El estado es requerido"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(150, "La descripción no puede tener más de 150 caracteres"),
  content: z.string().min(1, "El contenido es requerido"),
  dateStart: z.coerce.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "La fecha de inicio no es válida",
  }),
  dateEnd: z.coerce.date({
    required_error: "La fecha de fin es requerida",
    invalid_type_error: "La fecha de fin no es válida",
  }),
  location: z.string().nullable(),
  mainImage: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  secondImage: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  link: z.string().nullable(),
});
export const newsSaveSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  status: z.string().min(1, "El estado es requerido"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(150, "La descripción no puede tener más de 150 caracteres"),
  content: z.string().min(1, "El contenido es requerido"),
  published_at: z.coerce.date({
    required_error: "La fecha de publicacion es requerida",
    invalid_type_error: "La fecha de publicacion no es válida",
  }),
  mainImage: z.any().optional(),
  secondImage: z.any().optional(),
  link: z.string().nullable(),
});
export const courseSaveSchema = z.object({
  title: z.string().min(1, "El nombre del curso  es requerido"),
  language: z.string().nullable(),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(255, "La descripción no puede tener más de 255 caracteres"),
  content: z.string().min(1, "El contenido es requerido"),
  main_img: z.any().nullable(),
  second_img: z.any().nullable(),
  link: z.string().nullable(),
});

export const filterSaveSchema = z.object({
  icon: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  name: z.string().min(1, "El nombre del filtro es requerido"),
  options: z.array(
    z.object({
      option_name: z.string().min(1, "El nombre de la opción es requerido"),
    })
  ),
});
export const categorySaveSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  icon_url: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  labels: z
    .array(
      z.object({
        name: z.string().nullable(),
        bgColor: z.string().nullable(),
        textColor: z.string().nullable(),
      })
    )
    .nullable(),
  type: z.string().min(1, "El tipo es requerido"),
  filter_ids: z.array(z.number().nullable()).nullable(),
  files: z
    .array(
      z.object({
        // label: z.string().nullable(),
        file_type: z.string().nullable(),
      })
    )
    .nullable(),
});

export const productSaveSchema = z.object({
  company_id: z.string().min(1, "La empresa es requerida"),
  name: z.string().min(1, "El nombre del producto es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  featured_product: z.string({
    required_error: "Por favor, seleccione si es un producto destacado",
  }),
  // labels: z.array(z.number().nullable()).nullable(),
  labels: z.any().nullable(),
  category_id: z.string().min(1, "La categoría es requerida"),
  specifications: z
    .array(
      z.object({
        title: z.string().min(1, "El título es requerido"),
        description: z.string().min(1, "La descripción es requerida"),
      })
    )
    .min(1, "Las especificaciones son requeridas"),
  active_ingts: z
    .array(
      z.object({
        ingredient: z.string().nullable(),
        percentage: z.string().nullable(),
      })
    )
    .nullable(),
  img1: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  img2: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  // img3: z
  //   .custom<FileList>((files) => files?.length > 0, {
  //     message: "La imagen es requerida",
  //   })
  //   .nullable(),
  // img4: z
  //   .custom<FileList>((files) => files?.length > 0, {
  //     message: "La imagen es requerida",
  //   })
  //   .nullable(),
  // files: z
  //   .array(
  //     z.object({
  //       file_type: z.string().nullable(),
  //       file_label: z.string().nullable(),
  //     })
  //   )
  //   .nullable(),
  files: z.any().nullable(),
  status: z.string().min(1, "El estado es requerido"),
  // senasa_title: z.string().nullable(),
  senasa_number: z.string().nullable(),
  senasa_link: z.string().nullable(),
  chemical_class_title: z.string().nullable(),
  chemical_class_text: z.string().nullable(),
  chemical_class_url: z.any().nullable(),
});

export const rejectedMessage = z.object({
  message: z
    .string()
    .min(1, "El motivo es requerido")
    .max(255, "El motivo no puede tener más de 255 caracteres"),
});

export const adsSchema = z.object({
  company_id: z.string().min(1, "La empresa es requerida"),
  img: z
    .custom<FileList>((files) => files?.length > 0, {
      message: "La imagen es requerida",
    })
    .nullable(),
  type: z.string().min(1, "El tipo es requerido"),
  id_product: z.string().nullable(),

  // home_ads: z.array(
  //   z.object({
  //     img: z
  //       .custom<FileList>((files) => files?.length > 0, {
  //         message: "La imagen es requerida",
  //       })
  //       .nullable(),
  //   })
  // ),
  // navegations_ads: z.array(
  //   z.object({
  //     img: z
  //       .custom<FileList>((files) => files?.length > 0, {
  //         message: "La imagen es requerida",
  //       })
  //       .nullable(),
  //   })
  // ),
  // product_ads: z.array(
  //   z.object({
  //     img: z
  //       .custom<FileList>((files) => files?.length > 0, {
  //         message: "La imagen es requerida",
  //       })
  //       .nullable(),
  //   })
  // ),
});
