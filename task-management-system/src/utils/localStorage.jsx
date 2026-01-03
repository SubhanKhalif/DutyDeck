const employees = [
  {
    id: 1,
    email: "employee1@example.com",
    password: "12345678",
    tasks: [
      {
        title: "Prepare weekly report",
        description: "Compile and summarize weekly sales data.",
        date: "2025-06-10",
        category: "Reporting",
        active: true,
        newTask: true,
        completed: false,
        failed: false
      },
      {
        title: "Team meeting",
        description: "Discuss project roadmap with the team.",
        date: "2025-06-09",
        category: "Meetings",
        active: false,
        newTask: false,
        completed: true,
        failed: false
      },
      {
        title: "Client email follow-up",
        description: "Send a follow-up email to the client.",
        date: "2025-06-08",
        category: "Communication",
        active: false,
        newTask: false,
        completed: false,
        failed: true
      }
    ]
  },
  {
    id: 2,
    email: "employee2@example.com",
    password: "123",
    tasks: [
      {
        title: "Code review",
        description: "Review pull requests assigned to you.",
        date: "2025-06-11",
        category: "Development",
        active: true,
        newTask: true,
        completed: false,
        failed: false
      },
      {
        title: "Fix login bug",
        description: "Resolve the issue causing login failure.",
        date: "2025-06-07",
        category: "Bug Fix",
        active: false,
        newTask: false,
        completed: true,
        failed: false
      },
      {
        title: "Document API changes",
        description: "Update the API documentation with recent changes.",
        date: "2025-06-06",
        category: "Documentation",
        active: false,
        newTask: false,
        completed: false,
        failed: true
      },
      {
        title: "Sprint planning",
        description: "Plan the tasks for the upcoming sprint.",
        date: "2025-06-12",
        category: "Planning",
        active: true,
        newTask: true,
        completed: false,
        failed: false
      }
    ]
  },
  {
    id: 3,
    email: "employee3@example.com",
    password: "123",
    tasks: [
      {
        title: "Deploy update",
        description: "Deploy the latest version of the app.",
        date: "2025-06-10",
        category: "Deployment",
        active: false,
        newTask: false,
        completed: true,
        failed: false
      },
      {
        title: "UI testing",
        description: "Test all UI elements for functionality.",
        date: "2025-06-09",
        category: "Testing",
        active: true,
        newTask: true,
        completed: false,
        failed: false
      },
      {
        title: "Write test cases",
        description: "Add unit tests for new components.",
        date: "2025-06-08",
        category: "Testing",
        active: false,
        newTask: false,
        completed: true,
        failed: false
      },
      {
        title: "Fix modal bug",
        description: "Modal not closing on click outside.",
        date: "2025-06-07",
        category: "Bug Fix",
        active: false,
        newTask: false,
        completed: false,
        failed: true
      }
    ]
  },
  {
    id: 4,
    email: "employee4@example.com",
    password: "123",
    tasks: [
      {
        title: "Create wireframes",
        description: "Design initial wireframes for the homepage.",
        date: "2025-06-11",
        category: "Design",
        active: true,
        newTask: true,
        completed: false,
        failed: false
      },
      {
        title: "Update landing page",
        description: "Add testimonials section to the landing page.",
        date: "2025-06-08",
        category: "Frontend",
        active: false,
        newTask: false,
        completed: true,
        failed: false
      },
      {
        title: "Style footer section",
        description: "Improve UI of the footer for better UX.",
        date: "2025-06-09",
        category: "Design",
        active: true,
        newTask: false,
        completed: false,
        failed: false
      }
    ]
  },
  {
    id: 5,
    email: "employee5@example.com",
    password: "123",
    tasks: [
      {
        title: "Migrate database",
        description: "Move from SQL to NoSQL database.",
        date: "2025-06-07",
        category: "Database",
        active: false,
        newTask: false,
        completed: true,
        failed: false
      },
      {
        title: "Research caching solutions",
        description: "Look into Redis vs. Memcached options.",
        date: "2025-06-11",
        category: "Research",
        active: true,
        newTask: true,
        completed: false,
        failed: false
      },
      {
        title: "Clean test data",
        description: "Remove all temporary data from dev DB.",
        date: "2025-06-06",
        category: "Maintenance",
        active: false,
        newTask: false,
        completed: false,
        failed: true
      },
      {
        title: "Optimize queries",
        description: "Improve performance of existing SQL queries.",
        date: "2025-06-10",
        category: "Database",
        active: true,
        newTask: false,
        completed: false,
        failed: false
      }
    ]
  }
];

const admin = [
  {
    id: 100,
    email: "admin@example.com",
    password: "12345678"
  }
];

export const setLocalStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("admin", JSON.stringify(admin));
}

export const getLocalStorage = () => {
  const employeesData = localStorage.getItem("employees");
  const adminData = localStorage.getItem("admin");

  if (employeesData) {
    return {
      employees: JSON.parse(employeesData),
      admin: JSON.parse(adminData)
    };
  } else {
    return {
      employees: [],
      admin: []
    };
  }
}