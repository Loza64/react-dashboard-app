
import { useSession } from '@/hooks/useSession'
import User from '@/models/api/User'
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
    const { login, signup } = useSession()
    const [loginForm] = Form.useForm<LoginProps>()
    const [signUpForm] = Form.useForm<SignUpProps>()
    const [loading, setLoading] = useState(false)

    const handleLogin = async (values: LoginProps) => {
        setLoading(true)
        try {
            const result: User | null = await login(values.username.trim(), values.password)
            if (result) {
                message.success(`Bienvenido, ${result.username} 🎉`)
            } else {
                message.error('Usuario o contraseña incorrectos.')
            }
        } catch (error: unknown) {
            if (error instanceof Error) message.error(error.message)
            else message.error('Error al iniciar sesión. Intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (values: SignUpProps) => {
        if (values.password !== values.confirmPassword) {
            message.error('Las contraseñas no coinciden.')
            return
        }

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
                message.success(`Cuenta creada correctamente. Bienvenido, ${result.username}! 🎉`)
                signUpForm.resetFields()
            } else {
                message.error('Error al crear la cuenta.')
            }
        } catch (error: unknown) {
            if (error instanceof Error) message.error(error.message)
            else message.error('Error al registrar la cuenta. Intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-lg md:flex-row flex-col">
                {/* Formulario */}
                <div className="flex w-full flex-col justify-center p-6 md:w-1/2">
                    <Tabs defaultActiveKey="login" centered>
                        <Tabs.TabPane tab="Iniciar sesión" key="login">
                            <Form<LoginProps> form={loginForm} layout="vertical" onFinish={handleLogin} className="w-full">
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
                                    <Button type="primary" htmlType="submit" loading={loading} className="w-full">
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

                                <Form.Item
                                    label="Contraseña"
                                    name="password"
                                    rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
                                >
                                    <Input.Password placeholder="Contraseña" />
                                </Form.Item>

                                <Form.Item
                                    label="Confirmar contraseña"
                                    name="confirmPassword"
                                    rules={[{ required: true, message: 'Confirma tu contraseña' }]}
                                >
                                    <Input.Password placeholder="Confirmar contraseña" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                                        Registrarse
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane>
                    </Tabs>
                </div>

                {/* Imagen */}
                <div className="hidden md:block md:w-1/2">
                    <img src={''} alt="Login" className="h-full w-full object-cover" />
                </div>
            </div>
        </div>
    )
}
