export const useContactIcon = () => {
  return computed(() => (type: string) => {
    const icons: { [key: string]: string } = {
      other: 'mdi-contacts',
      whatsapp: 'mdi-whatsapp',
      email: 'mdi-email',
      phone: 'mdi-phone',
    }

    return icons[type]
  })
}

