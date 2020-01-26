<template>
  <v-data-table
    :headers="headers"
    :items="expenses"
    :items-per-page="10"
    sort-by="date"
    style="width: 85%"
    class="elevation-1"
  >
    <template v-slot:item.dueDate="{ item }">
      <div :class="dueCheck(item)">{{ item.dueDate }}</div>
    </template>

    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Expenses</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px"
          >s
          <template v-slot:activator="{ on }">
            <v-btn color="blue" dark class="mb-2" v-on="on">New Expense</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="postDateMenu"
                      :close-on-content-click="false"
                      :nudge-right="50"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="Date"
                          readonly
                          :value="editedItem.date"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.date"
                        no-title
                        @input="postDateMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-menu
                      v-model="postDueDateMenu"
                      :close-on-content-click="false"
                      :nudge-right="50"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="Due Date"
                          readonly
                          :value="editedItem.dueDate"
                          outlined
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.dueDate"
                        no-title
                        @input="postDueDateMenu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12" sm="6" md="4">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-select
                          :items="categories"
                          v-model="editedItem.expenseCategory"
                          label="Category"
                          outlined
                        ></v-select>
                      </template>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.amount"
                      label="Amount"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Event"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-menu offset-y>
                      <template v-slot:activator="{ on }">
                        <v-select
                          :items="statuses"
                          v-model="editedItem.expenseStatus"
                          label="Status"
                          outlined
                        ></v-select>
                      </template>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios'
import { eventBus } from '../main.js'

export default {
  name: 'ExpenseDataTable',

  data: () => ({
    rules: {
      'no-console': 'off'
    },
    dialog: false,
    getUrl: 'api/expense/getall',
    postUrl: 'api/expense/add',
    putUrl: 'api/expense/update/',
    deleteUrl: 'api/expense/delete/',
    categoriesUrl: 'api/expense/categories',
    postDateMenu: false,
    postDueDateMenu: false,
    date: null,
    dueDate: null,
    amount: null,
    event: null,
    expenseCategory: null,
    status: null,
    categories: [],
    statuses: ['PAID', 'UNPAID'],

    headers: [
      {
        text: 'Date',
        align: 'left',
        value: 'date'
      },
      { text: 'Category', value: 'expenseCategory' },
      { text: 'Amount', value: 'amount' },
      { text: 'Event', value: 'name' },
      { text: 'Marked as', value: 'expenseStatus' },
      { text: 'Due Date', value: 'dueDate' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    expenses: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      date: null,
      dueDate: null,
      expenseCategory: '',
      amount: null,
      name: '',
      expenseStatus: ''
    },
    defaultItem: {
      date: null,
      dueDate: null,
      expenseCategory: '',
      amount: null,
      name: '',
      expenseStatus: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Expense' : 'Edit Expense'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.fetchExpenses(), this.fetchCategories()
  },

  methods: {
    fetchExpenses() {
      axios
        .get(this.getUrl)
        .then(response => {
          this.expenses = response.data
        })
        .catch(error => {
          this.log(error)
        })
        .finally(() => (this.loading = false))
    },

    fetchCategories() {
      axios
        .get(this.categoriesUrl)
        .then(response => {
          this.categories = response.data
        })
        .catch(error => {
          this.log(error)
        })
        .finally(() => (this.loading = false))
    },

    editItem(item) {
      this.editedIndex = this.expenses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      confirm('Are you sure you want to delete this expense?') &&
        axios
          .delete(this.deleteUrl + item.id)
          .catch(error => {
            this.log(error)
          })
          .finally(() => this.fetchExpenses(), eventBus.$emit('updateBalances'))
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        axios
          .put(this.putUrl + this.editedItem.id, {
            amount: this.editedItem.amount,
            expenseCategory: this.editedItem.expenseCategory,
            name: this.editedItem.name,
            date: this.editedItem.date,
            dueDate: this.editedItem.dueDate,
            expenseStatus: this.editedItem.expenseStatus
          })
          .then(response => {
            this.message = response.data
          })
          .catch(error => {
            this.log(error)
          })
          .finally(() => this.fetchExpenses(), eventBus.$emit('updateBalances'))
      } else {
        axios
          .post(this.postUrl, {
            amount: this.editedItem.amount,
            expenseCategory: this.editedItem.expenseCategory,
            name: this.editedItem.name,
            date: this.editedItem.date,
            dueDate: this.editedItem.dueDate,
            expenseStatus: this.editedItem.expenseStatus
          })
          .then(response => {
            this.message = response.data
          })
          .catch(error => {
            this.log(error)
          })
          .finally(() => this.fetchExpenses(), eventBus.$emit('updateBalances'))
      }
      this.close()
    },

    dueCheck(item) {
      if (
        item.expenseStatus.localeCompare('UNPAID') === 0 &&
        Date.parse(item.dueDate) < Date.now()
      )
        return 'red--text font-weight-bold'
      else return ''
    },

    log(obj) {
      let parsedObject = JSON.parse(JSON.stringify(obj))
      // eslint-disable-next-line no-console
      console.log(parsedObject)
    }
  }
}
</script>
