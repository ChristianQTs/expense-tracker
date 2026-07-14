export const languages = [{ code: 'en', label: 'English' }, {code:'it', label:'Italiano'}]
export const translations = {
    en: {
        // Page Title
        pageTitle: 'Expenses Tracker',

        // Greeting
        welcome: 'Welcome',

        // Auth Labels
        logout: 'Log out',
        login: 'Log In Here',
        loginButton: 'Log In',
        register: 'Register',
        noAccountQuestion: 'Don\'t have an account?',
        alreadyHaveAccountQuestion: 'Already have an account?',
        confirm: 'Confirm',
        passwordMatch:'Passwords must match',
        // Dashboard Box Labels
        monthlyTotal: 'Monthly total',
        quarterlyTotal: 'Quarterly total',
        yearlyTotal: 'Yearly total',
        total: 'Total',
        totalForCategory: 'total', // Used in: `${filter} total:`
        percentageOfTotal: '% of total', // Used in: `${filter} % of total:`
        filterCategory: 'Filter by category',
        expensesFrom: 'Your expenses from',
        to: 'to',
        noMonthExpense : 'No expense for the current month',
        noQuarterExpense : 'No expense for the current quarter',
        noYearExpense: 'No expense for the current year',
        noExpenseYet: 'No expense yet',
        periodComparisonWarning: '(Budget period must be larger than or equal to the expense period to show tracking)',

        // Dynamic Toggles & Actions
        selectLanguage:'Select a language',
        showBudget: 'Show Budget',
        hideBudget: 'Hide Budget',
        ok: 'Ok',
        add: 'Add',
        edit: 'Edit',
        cancel:'Cancel',
        closeEdit: 'Close Edit',
        save: 'Save',
        selectExpensePeriod: 'Select an expense period',

        //expense fields
        name:'Name',
        amount:'Amount',
        category:'Category',

        // Category
        all: 'All', 
        Housing: 'Housing',
        Transportation: 'Transportation',
        Food: 'Food',
        Utilities: 'Utilities',
        Clothing: 'Clothing',
        Medical: 'Medical',
        Insurance: 'Insurance',
       'Household Supplies': 'Household Supplies',
        Personal: 'Personal',
        Debt: 'Debt',
        Retirement: 'Retirement',
        Education: 'Education',
        Savings: 'Savings',
        Gifts: 'Gifts',
        Entertainment: 'Entertainment',
        Taxes: 'Taxes',
        Fees: 'Fees',

        //Budget
        setBudgetLabel: 'Set a budget',
        setBudgetTypeLabel: 'Budget period',
        setBudgetButton: 'Set budget',
        selectBudgetTypeLabel: 'Select a budget period',
        noMonthlyBudgetYetLabel: 'You haven\'t set a monthly budget yet',
        noQuarterlyBudgetYetLabel: 'You haven\'t set a quarterly budget yet',
        noYearlyBudgetYetLabel: 'You haven\'t set a yearly budget yet',
        setBudgetNow:'Set it now',
        overspent:'Overspent',
        spent: 'spent',
        remaining: 'Remaining',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        yearly: 'Yearly',
        month: 'Month',
        quarter: 'Quarter',
        year: 'Year',
        monthlyBudget: 'Monthly budget',
        quarterlyBudget: 'Quarterly budget',
        yearlyBudget: 'Yearly budget',

        //Home
        prod_desc1: 'Easily keep track of your expenses.',
        prod_desc2: 'Set a budget for your expenses.',
        slogan: 'Manage your money wisely, track every cent.',
        startTracking: 'Start tracking!'
    },
    it: {
        // Page Title
        pageTitle: 'Gestione Spese',

        // Greeting
        welcome: 'Benvenuto',

        // Auth Labels
        logout: 'Disconnetti',
        login: 'Accedi al tuo account',
        loginButton: 'Accedi',
        register: 'Registrati',
        noAccountQuestion: 'Non hai ancora un account?',
        alreadyHaveAccountQuestion: 'Hai gia\' un account?',
        confirm: 'Conferma',
        passwordMatch:'Le password devono corrispondere',


        // Dashboard Box Labels
        monthlyTotal: 'Totale mensile', 
        quarterlyTotal: 'Totale trimestrale',
        yearlyTotal: 'Totale annuale',
        total: 'Totale',
        totalForCategory: 'totale', // Es: "cibo totale:"
        percentageOfTotal: '% del totale', // Es: "cibo % del totale:"
        filterCategory: 'Filtra per categoria',
        expensesFrom: 'Le tue spese dal',
        to: 'al',
        noMonthExpense: 'Nessuna spesa per il mese in corso',
        noQuarterExpense: 'Nessuna spesa per il trimestre in corso',
        noYearExpense: 'Nessuna spesa per l\' anno in corso',
        noExpenseYet: 'Nessuna spesa trovata',
        periodComparisonWarning: '(Il periodo di budget deve essere maggiore o uguale al periodo di spesa per mostrare il tracciamento)',

        // Dynamic Toggles & Actions
        selectLanguage:'Seleziona lingua',
        showBudget: 'Mostra Budget',
        hideBudget: 'Nascondi Budget',
        ok: 'Ok',
        add: 'Aggiungi',
        edit: 'Modfica',
        cancel: 'Annulla',
        closeEdit: 'Annulla',
        save: 'Salva',
        selectExpensePeriod : 'Seleziona un periodo per le tue spese',

        //expense fields
        name:'Nome',
        amount:'Importo',
        category:'Categoria',

        // Category
        all: 'Tutte',
        Housing: 'Alloggio',
        Transportation: 'Trasporti',
        Food: 'Cibo',
        Utilities: 'Utenze',
        Clothing: 'Abbigliamento',
        Medical: 'Spese Mediche',
        Insurance: 'Assicurazione',
       'Household Supplies': 'Articoli per la Casa',
        Personal: 'Spese Personali',
        Debt: 'Debiti',
        Retirement: 'Pensionamento',
        Education: 'Istruzione',
        Savings: 'Risparmi',
        Gifts: 'Regali',
        Entertainment: 'Intrattenimento',
        Taxes: 'Tasse',
        Fees: 'Commissioni',

        //Budget
        setBudgetLabel: 'Imposta un budget',
        setBudgetTypeLabel: 'Tipo budget',
        setBudgetButton: 'Imposta',
        selectBudgetTypeLabel: 'Seleziona un periodo per il budget',
        noMonthlyBudgetYetLabel: 'Non hai ancora impostato un budget mensile',
        noQuarterlyBudgetYetLabel: 'Non hai ancora impostato un budget trimestrale',
        noYearlyBudgetYetLabel: 'Non hai ancora impostato un budget annuale',
        setBudgetNow:'Impostalo ora',
        overspent:'Oltre il budget',
        spent:'speso',
        remaining: 'Rimanente',
        monthly: 'Mensile',
        quarterly: 'Trimestrale',
        yearly: 'Annuale',
        month: 'Mese',
        quarter: 'Trimestre',
        year: 'Anno',
        monthlyBudget: 'Budget mensile',
        quarterlyBudget: 'Budget trimestrale',
        yearlyBudget: 'Budget annuale',
        //Home
        prod_desc1: 'Tieni traccia delle tue spese facilmente.',
        prod_desc2: 'Imposta un budget per le tue spese.',
        slogan: 'Gestisci i tuoi soldi saggiamente, ogni centesimo conta.',
        startTracking: 'Inizia subito!'
        
    }
};
