
import { useSession } from '@/hooks/useSession'
import ErrorResponse from '@/models/api/ErrorResponse'
import User from '@/models/api/entities/User'
import errorResponse from '@/utils/errorResponse'
import { Button, Form, Input, message, Tabs } from 'antd'
import { useState } from 'react'

interface LoginProps {
    username: string
    password: string
}

interface SignUpProps {
    username: string
    name: string
    surname: string
    email: string
    password: string
    confirmPassword: string
}

export default function AuthView() {

    const { login, signup, saveSession } = useSession()
    const [loginForm] = Form.useForm<LoginProps>()
    const [signUpForm] = Form.useForm<SignUpProps>()
    const [loading, setLoading] = useState(false)
    const [errorLogin, setErrorLogin] = useState<ErrorResponse>()
    const [errorSignUp, setErrorSignUp] = useState<ErrorResponse>()

    const handleLogin = async (values: LoginProps) => {
        setLoading(true)
        setErrorLogin(undefined)
        try {
            const response = await login(values.username.trim(), values.password)
            if (response) {
                loginForm.resetFields()
                saveSession(response)
            }
        } catch (error: unknown) {
            const response = errorResponse({ error })
            setErrorLogin(response)
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (values: SignUpProps) => {
        if (values.password !== values.confirmPassword) {
            message.error('Las contraseñas no coinciden.')
            return
        }

        setErrorSignUp(undefined)
        setLoading(true)
        try {
            const payload: User = {
                username: values.username,
                name: values.name,
                surname: values.surname,
                email: values.email,
                password: values.password
            }
            const result = await signup(payload)
            if (result) {
                signUpForm.resetFields()
                saveSession(result)
            } else {
                message.error('Error al crear la cuenta.')
            }
        } catch (error: unknown) {
            const response = errorResponse({ error })
            setErrorSignUp(response)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-4xl mx-5 overflow-hidden rounded-xl bg-white shadow-lg md:flex-row flex-col min-h-[60dvh]">
                <div className="flex w-full flex-col justify-center p-6 md:w-1/2">
                    <Tabs defaultActiveKey="login" centered>
                        <Tabs.TabPane tab="Iniciar sesión" key="login">
                            <Form<LoginProps>
                                form={loginForm}
                                layout="vertical"
                                onFinish={handleLogin}
                                className="w-full"
                            >
                                <Form.Item
                                    label="Usuario"
                                    name="username"
                                    rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
                                >
                                    <Input placeholder="Usuario" />
                                </Form.Item>

                                <Form.Item
                                    label="Contraseña"
                                    name="password"
                                    rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                                >
                                    <Input.Password placeholder="Contraseña" />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        className={`w-full  font-bold! transform ${errorLogin ? 'error-move' : ''}`}
                                    >
                                        Iniciar sesión
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Registrarse" key="signup">
                            <Form<SignUpProps> form={signUpForm} layout="vertical" onFinish={handleSignUp} className="w-full">
                                <Form.Item
                                    label="Nombre de usuario"
                                    name="username"
                                    rules={[{ required: true, message: 'Por favor ingresa tu nombre de usuario' }]}
                                >
                                    <Input placeholder="Nombre de usuario" />
                                </Form.Item>

                                <Form.Item
                                    label="Nombre"
                                    name="name"
                                    rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
                                >
                                    <Input placeholder="Nombre" />
                                </Form.Item>

                                <Form.Item
                                    label="Apellido"
                                    name="surname"
                                    rules={[{ required: true, message: 'Por favor ingresa tu apellido' }]}
                                >
                                    <Input placeholder="Apellido" />
                                </Form.Item>

                                <Form.Item
                                    label="Correo electrónico"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Por favor ingresa tu correo' },
                                        { type: 'email', message: 'Ingresa un correo válido' }
                                    ]}
                                >
                                    <Input placeholder="correo@ejemplo.com" />
                                </Form.Item>

                                <div className='flex gap-1 w-full m-0 items-center'>
                                    <Form.Item
                                        label="Contraseña"
                                        name="password"
                                        rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                                        className='w-full!'
                                    >
                                        <Input.Password placeholder="Contraseña" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Confirmar contraseña"
                                        name="confirmPassword"
                                        rules={[{ required: true, message: 'Confirma tu contraseña' }]}
                                        className='w-full!'
                                    >
                                        <Input.Password placeholder="Confirmar contraseña" />
                                    </Form.Item>
                                </div>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} className={`w-full  font-bold! transform ${errorSignUp ? 'error-move' : ''}`}>
                                        Registrarse
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
                <div className="hidden md:block md:w-1/2">
                    <img src={''} alt="Login" className="h-full w-full object-cover" />
                </div>
            </div>
        </div>
    )
}
