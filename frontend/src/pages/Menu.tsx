function Menu() {
  return (
    <div className='w-full h-full p-4'>
      <div className='flex gap-8 h-full'>
        <div className='w-2/3 flex flex-wrap h-full gap-x-6 gap-y-6  border-r-2 border-gray-100'>
          <div className='bg-gray-100 p-8 rounded-xl h-fit'>
            <p className='text-lg font-bold'>Classic Tea</p>
            <p className='text-sm'>$4.00</p>
          </div>

          <div className='bg-gray-100 p-8 rounded-xl h-fit'>
            <p className='text-lg font-bold'>Classic Tea</p>
            <p className='text-sm'>$4.00</p>
          </div>

          <div className='bg-gray-100 p-8 rounded-xl h-fit'>
            <p className='text-lg font-bold'>Classic Tea</p>
            <p className='text-sm'>$4.00</p>
          </div>
        </div>

        {/* Right: Order Total (1/3) */}
        <div className='w-1/3 p-4 space-y-12'>
          <div className="text-3xl font-semibold flex justify-between">
            <p>Order #</p>
            <p>123456</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl flex justify-between">
              <div>
                <p className="text-xl font-bold">Classic Tea</p>
                <p className="px-2">$4.00</p>
              </div>

              <div>
                <p>Quantity</p>
                <p className="px-2">1</p>
              </div>
            </div>

            <div>
              <div className="bg-gray-100 p-4 rounded-xl flex justify-between">
                <div>
                  <p className="text-xl font-bold">Classic Tea</p>
                  <p className="px-2">$4.00</p>
                </div>

                <div>
                  <p>Quantity</p>
                  <p className="px-2">1</p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-100 p-4 rounded-xl flex justify-between">
                <div>
                  <p className="text-xl font-bold">Classic Tea</p>
                  <p className="px-2">$4.00</p>
                </div>

                <div>
                  <p>Quantity</p>
                  <p className="px-2">1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 border border-gray-100">
            <div className="flex justify-between">
              <p>Subtotal</p>

              <p>$12.00</p>
            </div>

            <div className="flex justify-between">
              <p>Tax 8.25%</p>

              <p>$12.00</p>
            </div>

            <div className="flex justify-between text-2xl font-bold">
              <p>Total</p>

              <p>$12.00</p>
            </div>

            <div className="flex gap-x-8 my-8">
              <button className="bg-red-500 text-white p-3 rounded-2xl w-full hover:bg-red-600">Cancel Order</button>

              <button className="bg-green-500 text-white p-3 rounded-2xl w-full hover:bg-green-600">Submit Order</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Menu
