const API_BASE_URL = "https://practicasprofesionales-4.onrender.com/cliente";

document.getElementById("create-client-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const cliente = {
        dni: parseInt(document.getElementById("dni").value),
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value, // asegurar formato YYYY-MM-DD
        tipoPersona: document.getElementById("tipoPersona").value,
        cuentas: []
    };

    console.log('Datos a enviar:', cliente);

    try {
        const response = await fetch('https://practicasprofesionales-4.onrender.com/cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(cliente),
            mode: 'cors' 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Respuesta exitosa:', data);
        document.getElementById("create-client-response").textContent = "Cliente creado exitosamente.";
        
    } catch (error) {
        console.error('Error completo:', error);
        document.getElementById("create-client-response").textContent = 
            `Error al crear cliente: ${error.message}`;
    }
});
document.getElementById("buscarCliente").addEventListener("submit", async (event) => {
    event.preventDefault();

    const dni = document.getElementById("buscarDni").value;

    try {
        const response = await fetch(`${API_BASE_URL}/${dni}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        const details = `
            <h3>Detalles del Cliente</h3>
            <p><strong>DNI:</strong> ${data.dni}</p>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Apellido:</strong> ${data.apellido}</p>
            <p><strong>Fecha de Nacimiento:</strong> ${data.fechaNacimiento}</p>
            <p><strong>Tipo de Persona:</strong> ${data.tipoPersona}</p>
        `;
        document.getElementById("detallesCliente").innerHTML = details;
    } catch (error) {
        document.getElementById("detallesCliente").textContent = `Error al buscar cliente: ${error.message}`;
        console.error(error);
    }
}

);

document.getElementById("agregarCuenta").addEventListener("submit", async (event) => {
    event.preventDefault();

    const cuenta = {
        dniCliente: parseInt(document.getElementById("cuentaPorDni").value),
        tipoCuenta: document.getElementById("tipoCuenta").value,
        moneda: document.getElementById("monedaCuenta").value
    };

    console.log('Datos de la cuenta a enviar:', cuenta); 

    try {
        const response = await fetch("https://practicasprofesionales-4.onrender.com/cuenta", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(cuenta),
            mode: "cors" 
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Cuenta agregada exitosamente:', data);
        document.getElementById("respuestaAgregarCuenta").textContent = "Cuenta agregada exitosamente.";
    } catch (error) {
        console.error('Error completo:', error);
        document.getElementById("respuestaAgregarCuenta").textContent = 
            `Error al agregar cuenta: ${error.message}`;
    }
});

const API_ACCOUNT_URL = "https://practicasprofesionales-4.onrender.com/cuenta"; 

document.getElementById("buscarCuenta").addEventListener("submit", async (event) => {
    event.preventDefault();

    const accountNumber = document.getElementById("numeroCuenta").value;

    try {
        const response = await fetch(`${API_ACCOUNT_URL}/${accountNumber}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - Cuenta no encontrada`);
        }

        const data = await response.json();
        console.log('Cuenta encontrada:', data);

        const details = `
            <h3>Detalles de la Cuenta</h3>
            <p><strong>Número de Cuenta:</strong> ${data.numeroCuenta}</p>
            <p><strong>Fecha de Creación:</strong> ${data.fechaCreacion}</p>
            <p><strong>Balance:</strong> ${data.balance}</p>
            <p><strong>Tipo de Cuenta:</strong> ${data.tipoCuenta}</p>
            <p><strong>Moneda:</strong> ${data.moneda}</p>
        `;
        document.getElementById("respuestaBuscarCuenta").innerHTML = details;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("respuestaBuscarCuenta").textContent = 
            `Error al buscar la cuenta: ${error.message}`;
    }
});

document.getElementById("BuscarCuentaporDni").addEventListener("submit", async (event) => {
    event.preventDefault();

    const dni = document.getElementById("BuscarCuentaDni").value;

    try {
        const response = await fetch(`${API_ACCOUNT_URL}/dni/${dni}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - Cliente no encontrado`);
        }

        const data = await response.json();
        console.log('Cuentas encontradas:', data);

        let accountList = `
            <h3>Cuentas del Cliente</h3>
            <ul>
        `;
        data.forEach((account) => {
            accountList += `
                <li>
                    <strong>Número de Cuenta:</strong> ${account.numeroCuenta} - 
                    <strong>Balance:</strong> ${account.balance} - 
                    <strong>Tipo:</strong> ${account.tipoCuenta} - 
                    <strong>Moneda:</strong> ${account.moneda}
                </li>
            `;
        });
        accountList += "</ul>";

        document.getElementById("respuestaBuscarPorDni").innerHTML = accountList;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("respuestaBuscarPorDni").textContent = 
            `Error al buscar cuentas: ${error.message}`;
    }   
});
document.getElementById("buscarTransacciones").addEventListener("submit", async (event) => {
    event.preventDefault();

    const accountNumber = document.getElementById("BuscarTransaccionPorNumero").value;

    try {
        const response = await fetch(`${API_ACCOUNT_URL}/${accountNumber}/transacciones`);

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error("Cuenta no encontrada.");
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        }

        const data = await response.json();

        // Verifica si el objeto recibido tiene transacciones
        if (!data || !data.transacciones || data.transacciones.length === 0) {
            document.getElementById("respuestaTransaccion").textContent =
                "No se encontraron transacciones para esta cuenta.";
            return;
        }

        // Muestra los movimientos
        const transactionsList = data.transacciones
            .map(
                (transaction) => `
                <div>
                    <p><strong>Fecha:</strong> ${transaction.fecha}</p>
                    <p><strong>Tipo:</strong> ${transaction.tipo}</p>
                    <p><strong>Descripción:</strong> ${transaction.descripcionBreve}</p>
                    <p><strong>Monto:</strong> ${transaction.monto}</p>
                </div>
                <hr>
            `
            )
            .join("");

        document.getElementById("respuestaTransaccion").innerHTML = `
            <h3>Transacciones para la Cuenta ${data.numeroCuenta}</h3>
            ${transactionsList}
        `;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("respuestaTransaccion").textContent =
            `Error al buscar transacciones: ${error.message}`;
    }
});
//ERROR MODIFICAR
//PREGUNTAR
const API_TRANSACTION_URL = "https://practicasprofesionales-4.onrender.com/api"; // Cambia la URL si es necesario

// Transferencia
document.getElementById("transferencia").addEventListener("submit", async (event) => {
    event.preventDefault();

    const transferencia = {
        cuentaOrigen: parseInt(document.getElementById("cuentaOrigen").value, 10),
        cuentaDestino: parseInt(document.getElementById("cuentaDestino").value, 10),
        monto: parseFloat(document.getElementById("montoTransferencia").value),
        moneda: document.getElementById("monedaTransferencia").value,
    };

    try {
    const response = await fetch(`${API_TRANSACTION_URL}/transfer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(transferencia, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ),
    });

    // Leer la respuesta como JSON
    const data = await response.json();

    // Verificar si el servidor indicó un error en el cuerpo de la respuesta
    if (!response.ok || data.estado === "FALLIDA") {
        // Lanzar error con el mensaje del backend si está disponible
        throw new Error(data.mensaje || `Error inesperado: HTTP ${response.status}`);
    }

    // Éxito: muestra una alerta verde
    Swal.fire({
        icon: "success",
        title: "Transferencia Exitosa",
        text: `${data.estado}: ${data.mensaje}`,
        confirmButtonColor: "#4CAF50",
    });
} catch (error) {
    console.error("Error al realizar transferencia:", error);

    // Error: muestra una alerta roja
    Swal.fire({
        icon: "error",
        title: "Error al realizar transferencia",
        text: `${error.message}`,
        confirmButtonColor: "#E74C3C",
    });
}
});
//MODIFICAR LAS ALERTAS
// Depósito
document.getElementById("RealizarDeposito").addEventListener("submit", async (event) => {
    event.preventDefault();

    const deposito = {
        cuenta: parseInt(document.getElementById("cuentaDeposito").value, 10),
        monto: parseFloat(document.getElementById("montoDeposito").value),
        moneda: document.getElementById("monedaDeposito").value,
    };

    try {
        const response = await fetch(`${API_TRANSACTION_URL}/deposito`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(deposito, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ),
        });

        // Leer la respuesta como JSON
        const data = await response.json();

        // Verificar si el servidor indicó un error en el cuerpo de la respuesta
        if (!response.ok || data.estado === "FALLIDA") {
            // Lanzar error con el mensaje del backend si está disponible
            throw new Error(data.mensaje || `Error inesperado: HTTP ${response.status}`);
        }

        // Éxito: muestra una alerta verde
        Swal.fire({
            icon: "success",
            title: "Depósito Exitoso",
            text: `${data.estado}: ${data.mensaje}`,
            confirmButtonColor: "#4CAF50",
        });
    } catch (error) {
        console.error("Error al realizar depósito:", error);

        // Error: muestra una alerta roja
        Swal.fire({
            icon: "error",
            title: "Error al realizar depósito",
            text: `${error.message}`,
            confirmButtonColor: "#E74C3C",
        });
    }
});



// Retiro
document.getElementById("RealizarRetiro").addEventListener("submit", async (event) => {
    event.preventDefault();

    const retiro = {
        cuenta: parseInt(document.getElementById("cuentaRetiro").value, 10),
        monto: parseFloat(document.getElementById("montoRetiro").value),
        moneda: document.getElementById("monedaRetiro").value,
    };

    try {
        const response = await fetch(`${API_TRANSACTION_URL}/retiro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(retiro, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ),
        });

        // Leer la respuesta como JSON
        const data = await response.json();

        // Verificar si el servidor indicó un error en el cuerpo de la respuesta
        if (!response.ok || data.estado === "FALLIDA") {
            // Lanzar error con el mensaje del backend si está disponible
            throw new Error(data.mensaje || `Error inesperado: HTTP ${response.status}`);
        }

        // Éxito: muestra una alerta verde
        Swal.fire({
            icon: "success",
            title: "Retiro Exitoso",
            text: `${data.estado}: ${data.mensaje}`,
            confirmButtonColor: "#4CAF50",
        });
    } catch (error) {
        console.error("Error al realizar retiro:", error);

        // Error: muestra una alerta roja
        Swal.fire({
            icon: "error",
            title: "Error al realizar retiro",
            text: `${error.message}`,
            confirmButtonColor: "#E74C3C",
        });
    }
});
