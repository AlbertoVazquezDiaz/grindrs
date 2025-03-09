const ContactUs = () => {
    return (
        <div className="max-w-4xl mx-auto py-8 px-6 sm:px-8 lg:px-10 bg-black shadow-lg rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-white text-center">
                ¡Queremos saber de ti!
            </h2>
            <p className="mt-2 text-white text-center">
                Si tienes alguna pregunta o sugerencia, estaremos felices de ayudarte.
                Déjanos un mensaje y te responderemos pronto.
            </p>

            <form action="#" method="POST" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="first_name"
                            className="block text-sm font-medium text-white"
                        >
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            autoComplete="given-name"
                            className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="last_name"
                            className="block text-sm font-medium text-white"
                        >
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            autoComplete="family-name"
                            className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
                            placeholder="Tu apellido"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white"
                    >
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
                        placeholder="tuemail@ejemplo.com"
                    />
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="message"
                        className="block text-sm font-medium text-white"
                    >
                        Mensaje
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        rows="4"
                        className="mt-1 block w-full border-b  shadow-sm  text-white sm:text-sm p-2 focus:ring-0 focus:outline-none focus:border-b-yellow-400 hover:border-b-yellow-400"
                        placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                </div>

                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        className="w-full md:w-auto inline-flex justify-center py-4 px-8 border border-transparent shadow-sm text-sm font-bold text-black rounded-md bg-[#ffbb00]  focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                    >
                        ENVIAR
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactUs;
