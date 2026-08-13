function ProductsView() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-5 text-center font-sans text-gray-800">
      <h1 className="mb-4 text-3xl font-light">Productos</h1>
      <p className="max-w-md text-gray-500">
        Ejemplo de ruta pública nueva (/public/products). Se agregó sin
        modificar AppOutlet, OutletContainer ni permission.app.ts: solo se
        registró en routes.app.ts y se creó este archivo de página.
      </p>
    </div>
  )
}

export default ProductsView
