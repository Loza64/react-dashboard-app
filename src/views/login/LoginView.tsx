import { useSession } from '@/hooks/useSession'
import User from '@/models/entities/User'
import { Button, Form, Input, message, Tabs } from 'antd'

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
  const { login, signup, saveSession, loading } = useSession()

  const [loginForm] = Form.useForm<LoginProps>()
  const [signUpForm] = Form.useForm<SignUpProps>()

  const handleLogin = async (values: LoginProps) => {
    try {
      const response = await login({
        username: values.username.trim(),
        password: values.password,
        onUnauthorized() {
          message.warning('Usuario o contraseña incorrectos')
        },
      })

      loginForm.resetFields()
      saveSession(response)
    } catch (error: unknown) {
      console.error(error)
    }
  }

  const handleSignUp = async (values: SignUpProps) => {
    if (values.password !== values.confirmPassword) {
      message.error('Las contraseñas no coinciden.')
      return
    }

    try {
      const payload: User = {
        username: values.username,
        name: values.name,
        surname: values.surname,
        email: values.email,
        password: values.password,
      }
      const result = await signup(payload)
      signUpForm.resetFields()
      saveSession(result)
    } catch (error: unknown) {
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="mx-5 flex min-h-[60dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-lg md:flex-row">
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
                  rules={[{ required: true, message: 'Ingresa tu usuario' }]}
                >
                  <Input placeholder="Usuario" />
                </Form.Item>

                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
                >
                  <Input.Password placeholder="Contraseña" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.login}
                    className="w-full font-bold!"
                  >
                    Iniciar sesión
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>

            {/* 📝 SIGNUP */}
            <Tabs.TabPane tab="Registrarse" key="signup">
              <Form<SignUpProps>
                form={signUpForm}
                layout="vertical"
                onFinish={handleSignUp}
                className="w-full"
              >
                <Form.Item
                  label="Usuario"
                  name="username"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nombre de usuario" />
                </Form.Item>

                <Form.Item
                  label="Nombre"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Nombre" />
                </Form.Item>

                <Form.Item
                  label="Apellido"
                  name="surname"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Apellido" />
                </Form.Item>

                <Form.Item
                  label="Correo"
                  name="email"
                  rules={[
                    { required: true },
                    { type: 'email', message: 'Correo inválido' },
                  ]}
                >
                  <Input placeholder="correo@ejemplo.com" />
                </Form.Item>

                <div className="flex gap-2">
                  <Form.Item
                    label="Contraseña"
                    name="password"
                    className="w-full!"
                    rules={[
                      { required: true, message: 'Ingrese la contraseña' },
                      {
                        min: 8,
                        message:
                          'La contraseña debe tener al menos 8 caracteres',
                      },
                      {
                        pattern:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
                        message:
                          'Debe incluir mayúsculas, minúsculas, números y un carácter especial',
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    label="Confirmar"
                    name="confirmPassword"
                    dependencies={['password']}
                    className="w-full!"
                    rules={[
                      {
                        required: true,
                        message: 'Confirma la contraseña',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                          }

                          return Promise.reject(
                            new Error('Las contraseñas no coinciden')
                          )
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.signup}
                    className="w-full font-bold!"
                  >
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
