import { useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";



export default function ExpenseForm({ onCancel, onSubmit, submitButtonLabel, expense }) {
    const [inputs, setInputs] = useState({
        amount: {
					value: expense ? expense.amount.toString() : '',
					isValid: true,
				},
        date: {
					value: expense ? getFormattedDate(expense.date) : '',
					isValid: true,
				},
        description: {
					value: expense ? expense.description : '',
					isValid: true,
				},
    });

    function inputChangeHandler(inputIdentifier, enteredValue) {
        setInputs((curInputs) => {
            return {...curInputs, [inputIdentifier]: { value: enteredValue, isValid: true }};
        })
    }
    
		function submitHandler() {
			const expenseData = {
				amount: +inputs.amount.value,
				date: new Date(inputs.date.value),
				description: inputs.description.value,
			};

			const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
			const dateIsValid = expenseData.date.toString() !== 'Invalid Date';
			const descriptionIsValid = expenseData.description.trim().length > 0;

			if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
				setInputs((curInputs) => {
					return {
						amount: { value: curInputs.amount.value, isValid: amountIsValid },
						date: { value: curInputs.date.value, isValid: dateIsValid },
						description: { value: curInputs.description.value, isValid: descriptionIsValid },
					};
				})
				return;
			}

			onSubmit(expenseData);
		}

		const formIsInvalid = (
			!inputs.amount.isValid || 
			!inputs.date.isValid || 
			!inputs.description.isValid
		);
    
    return (
      <View style={styles.form}>
        <Text style={styles.title}>Your Expense</Text>

        <View style={styles.inputsRow}>
          <Input
            label="Amount"
						invalid={!inputs.amount.isValid}
            options={{
              keyboardType: "decimal-pad",
              onChangeText: inputChangeHandler.bind(this, "amount"),
              value: inputs.amount.value,
            }}
            style={styles.rowInput}
          />
          <Input
            label="Date"
						invalid={!inputs.date.isValid}
            options={{
              placeholder: "YYYY-MM-DD",
              maxLength: 10,
              onChangeText: inputChangeHandler.bind(this, "date"),
              value: inputs.date.value,
            }}
            style={styles.rowInput}
          />
        </View>

        <Input
          label="Description"
					invalid={!inputs.description.isValid}
          options={{
            multiline: true,
            onChangeText: inputChangeHandler.bind(this, "description"),
            value: inputs.description.value,
          }}
        />

				{
					formIsInvalid &&
					<Text style={styles.errorText}>Invalid input values - please check your entered data!</Text>
				}

        <View style={styles.buttons}>
          <Button style={styles.button} mode="flat" onPress={onCancel}>
            Cancel
          </Button>
          <Button style={styles.button} onPress={submitHandler}>
            {submitButtonLabel}
          </Button>
        </View>

      </View>
    );
}


const styles = StyleSheet.create({
    inputsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    rowInput: {
        flex: 1,
    },
    form: {
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: 'white',
        marginVertical: 24,
        textAlign: "center"
    },
		errorText: {
			textAlign: "center",
			color: GlobalStyles.colors.error500,
			margin: 8,
		},
		buttons: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
		button: {
			minWidth: 120,
			marginHorizontal: 8,
		},
});