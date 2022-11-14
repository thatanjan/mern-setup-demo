import {
	Heading,
	Center,
	Button,
	Box,
	Input,
	FormControl as Form,
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'

const axiosInstance = axios.create({
	// Getting the api url from environments
	baseURL: process.env.NEXT_PUBLIC_API_URL,
})

const Home = () => {
	const [todos, setTodos] = useState([])
	const [inputVal, setInputVal] = useState('')
	const [refresh, setRefresh] = useState(false)

	// Getting all the todos
	const getTodos = () => {
		axiosInstance.get('/getAllTodos').then(res => setTodos(res.data))
	}

	// Displaying all the todos on first render
	useEffect(() => {
		getTodos()
	}, [])

	// refreshing all the todos when the todos are going to be updated
	useEffect(() => {
		if (refresh) {
			getTodos()

			setTimeout(() => {
				setRefresh(false)
			})
		}
	}, [refresh])

	// Deleting the todo
	const deleteTodo = todoId => () => {
		axiosInstance
			.delete('/deleteTodo', {
				data: { todoId },
			})
			.then(() => setRefresh(true))
	}

	// Adding a todo
	const addTodo = e => {
		e.preventDefault()
		axiosInstance.post('/addTodo', { title: inputVal }).then(() => {
			setRefresh(true)
			setInputVal('')
		})
	}

	return (
		<>
			<Heading mb={12}>MERN</Heading>

			<Form mb={10} as='form' onSubmit={addTodo}>
				<Input
					onChange={e => setInputVal(e.target.value)}
					width='300px'
					placeholder='New Todo'
					size='md'
					value={inputVal}
				/>
				<Button type='submit'>Add</Button>
			</Form>

			{/* Display all the todos */}
			{todos.map(({ _id, title }) => (
				<Box key={_id} mb={10}>
					<Center w='180px' h='80px' bg='red.200'>
						{title}
					</Center>
					<Button onClick={deleteTodo(_id)}>Delete</Button>
				</Box>
			))}
		</>
	)
}

export default Home
