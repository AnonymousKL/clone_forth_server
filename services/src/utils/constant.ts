export const menus = [
  // {
  //   title: 'Dashboard',
  //   link: '/',
  // },
  {
    title: 'Projects',
    link: '/projects',
    children: {
      title: ''
    }
  },
  {
    title: 'Members',
    link: '/members',
    children: {
      title: ''
    }
  },
  {
    title: 'Time Sheet',
    link: '/timesheet',
  },
  // {
  //   title: 'Sales',
  //   link: '/sales',
  // },
  // {
  //   title: 'Contract',
  //   link: '/contract',
  // },
  // {
  //   title: 'Cash Flow',
  //   link: '/cashflow',
  // }
]

export const statusOptions = [
  {
    name: 'All status',
    value: ''
  },
  {
    name: 'Planning',
    value: 'Planning'
  },
  {
    name: 'Inprogress',
    value: 'Inprogress'
  },
  {
    name: 'Completed',
    value: 'Completed'
  },
  {
    name: 'Overdue',
    value: 'Overdue'
  },
  {
    name: 'Cancel',
    value: 'Cancel'
  },
]

export const healthOptions = [
  {
    name: 'Strong',
    value: 'Strong'
  },
  {
    name: 'Weak',
    value: 'Weak',
  }
]

export const priorityOptions = [
  {
    name: 'Highest',
    value: 'Highest'
  },
  {
    name: 'High',
    value: 'High',
  },
  {
    name: 'Medium',
    value: 'Medium',
  },
  {
    name: 'Low',
    value: 'Low',
  },
  {
    name: 'Lowest',
    value: 'Lowest',
  }
]

export const workModelOptions = [
  {
    name: 'Onsite',
    value: 0,
  },
  {
    name: 'Hybrid',
    value: 1,
  },
  {
    name: 'Remote',
    value: 2,
  },
]

// TODO: Fetch from API
export const roleOptions = [
  {
    name: 'Developer',
    value: 1,
  },
  {
    name: 'Designer',
    value: 2,
  },
  {
    name: 'QA/QC',
    value: 3,
  },
  {
    name: 'PM',
    value: 4,
  },
]

// TODO: Fetch from API
export const teamOptions = [
  {
    name: 'QA/QC',
    value: 1,
  },
  {
    name: 'Technical',
    value: 2,
  },
  {
    name: 'Designing',
    value: 3,
  }
]

export const workModel = {
  0: 'Onsite',
  1: 'Hybrid',
  2: 'Remote'
}

export const projectStatus = {
  0: 'Planning',
  1: 'Inprogress',
  2: 'Completed',
  3: 'Overdue',
  4: 'Cancel'
}

export enum ProjectStatus {
  Planning = 0,
  Inprogress = 1,
  Completed = 2,
  Overdue = 3,
  Canceled = 4
}

export enum Priority {
  Lowest = 'Lowest',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Highest = 'Highest'
}

export enum Health {
  Strong = 'Strong',
  Weak = 'Weak'
}

export const PAYMENT_RATE_PER_HOUR = 20
