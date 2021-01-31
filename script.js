const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add("active")
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove("active")
    }
}

/*const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'App',
        amount: 20000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    }
]*/

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        //transactions.reverse()
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
        // setItem: 1º argumento é o nome (pode ser um nome qualquer) e o 2º argumento é o objecto
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        Transaction.all.reverse() // para inverter a ordem do array
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        // Somar as entradas
        // pegar todas as transactions
        // para cada transação, se for maior que zero
        //somar a uma variável e retornar a variável

        let income = 0;
        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        // Somar as saidas
        // pegar todas as transactions
        // para cada transação, se for menor que zero
        //somar a uma variável e retornar a variável

        let expense = 0;
        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },
    total() {
        // Somar as entredas e as saídas
        return Transaction.incomes() + Transaction.expenses()
    }
}

// Preciso de ter as transações do objecto e colocar no HTML

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = UTILS.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td> <img onclick="Transaction.remove(${index})" src="./assets/assets/minus.svg" alt="Remover Transação">
        </td>`
        return html
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = UTILS.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = UTILS.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = UTILS.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const UTILS = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")  /// substitui todos os caracters que não sejam número  
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },
    formatAmount(amount) {
        amount = Number(amount.replace(/\,\./g, "")) * 100

        return amount
    },
    formatDate(date) {
        const splitedDate = date.split("-") // procurar o '-' como separador
        // retornar a data no formato "26/01/2021"
        return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        // const description = Form.getValues().description;
        // const amount = Form.getValues().amount;
        //const date = Form.getValues().date;

        //utilizando a desestruturação, fica: 
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }

    },
    formatData() {
        let { description, amount, date } = Form.getValues()
        amount = UTILS.formatAmount(amount)
        date = UTILS.formatDate(date)
        total = Storage.get().length + 1
        let id = 0
        while (id < total) {
            id += total
            console.log(id)
        }

        return {
            id,
            description,
            amount,
            date
        }
    },
    saveTransaction(transaction) {
        Transaction.add(transaction)
    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },


    submit(event) {
        event.preventDefault()

        try {
            // verificar se todas as informações foram preenchidas
            Form.validateFields()
            // formatar os dados para salvar
            const transaction = Form.formatData()
            // salvar
            Form.saveTransaction(transaction)
            // os dados do formulário devem ser apagados
            Form.clearFields()
            // fechar o modal
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        Transaction.all.reverse() // Para inverter a ordem na tabela.

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()

Transaction.add({
    id: 1,
    description: 'id1',
    amount: 10,
    date: '12/12/2021'
})

Transaction.add({
    id: 2,
    description: 'id2',
    amount: 20,
    date: '12/12/2021'
})
