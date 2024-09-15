export const studentsMenuButtons = [
    { name: "Listar Alunos", link: "/students" },
    { name: "Adicionar Alunos", link: "/addStudents" },
    { name: "Inscrições", link: "/enrollStudents" },
];
export const coursesMenuButtons = [
    { name: "Listar Cursos", link: "/courses" },
    { name: "Adicionar Cursos", link: "/addCourse" },
];
export const lessonsMenuButtons = [
    { name: "Listar Aulas", link: "/lessons" },
    { name: "Adicionar Aulas", link: "/addLesson" },
    { name: "Marcar Presenças", link: "/addAttendance" },
    { name: "Ver Presenças", link: "/attendance" },
];
export const modulesMenuButtons = [
    { name: "Listar Módulos", link: "/modules" },
    { name: "Adicionar Módulos", link: "/addModule" },
    {
        name: "Atribuir Módulo a Professor",
        link: "/associateProfessorToModule",
    },
    {
        name: "Prof. Encarregues de Módulos",
        link: "/professorsInChargeOfModules",
    },
    { name: "Listar Submódulos", link: "/subModules" },
    { name: "Adicionar Submódulos", link: "/addSubmodule" },
    { name: "Associar Módulos a Curso", link: "/associateModulesToCourse" },
];

export const evaluationMomentsMenuButtons = [
    { name: "Listar Momentos de Avaliação", link: "/evaluationMoments" },
    { name: "Adicionar Momentos de Avaliação", link: "/addEvaluationMoment" },
    { name: "Editar Momentos de Avaliação", link: "/editEvaluationMoment" },
];

export const gradesMenuButtons = [
    { name: "Atribuir Notas", link: "/assignGrades" },
    { name: "Editar Notas", link: "/editGrades" },
    { name: "Apagar Notas", link: "/deleteGrades" },
    { name: "Calcular Notas", link: "/calculateGrades" },
    { name: "Pauta", link: "/gradeSheet" },
];