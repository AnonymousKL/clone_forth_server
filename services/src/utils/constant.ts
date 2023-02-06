export const menus = [
  {
    title: 'Dashboard',
    link: '/',
  },
  {
    title: 'Projects',
    link: '/projects',
    children: {
      title: ''
    }
  },
  {
    title: 'Members',
    link: '/users',
    children: {
      title: ''
    }
  },
  {
    title: 'Sales',
    link: '/sales',
  },
  {
    title: 'Contract',
    link: '/contract',
  },
  {
    title: 'Cash Flow',
    link: '/cashflow',
  }
]

export const projectStatus = {
  planning: 'Planning',
  completed: 'Completed',
  processing: 'Processing',
  cancel: 'Cancel',
  overdue: 'Overdue'
}
