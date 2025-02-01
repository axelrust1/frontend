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
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al Buscar Cliente',
            text: `No se encontró el cliente con DNI: ${dni}`,
            confirmButtonColor: '#E74C3C'
        });
    }
}

);
document.getElementById("buscarParaEditar").addEventListener("click", async () => {
    const dni = document.getElementById("editarDni").value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${dni}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        document.getElementById("editarNombre").value = data.nombre;
        document.getElementById("editarApellido").value = data.apellido;
        document.getElementById("editarFechaNacimiento").value = data.fechaNacimiento;
        document.getElementById("editarTipoPersona").value = data.tipoPersona == 'PERSONA_FISICA' ? 'F' : 'J';
        
        document.getElementById("datosParaEditar").style.display = "block";
        
        document.getElementById("editarDni").disabled = true;
        document.getElementById("buscarParaEditar").disabled = true;

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al Buscar Cliente',
            text: `No se encontró el cliente con DNI: ${dni}`,
            confirmButtonColor: '#E74C3C'
        });
    }
});

document.getElementById("editarCliente").addEventListener("reset", () => {
    document.getElementById("datosParaEditar").style.display = "none";
    document.getElementById("editarDni").disabled = false;
    document.getElementById("buscarParaEditar").disabled = false;
});


document.getElementById("editarCliente").addEventListener("submit", async (event) => {
    event.preventDefault();

    const dni = parseInt(document.getElementById("editarDni").value);
    const clienteUpdate = {
        nombre: document.getElementById("editarNombre").value,
        apellido: document.getElementById("editarApellido").value,
        fechaNacimiento: document.getElementById("editarFechaNacimiento").value,
        tipoPersona: document.getElementById("editarTipoPersona").value === "PERSONA_JURIDICA" ? "J" : "F"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${dni}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(clienteUpdate),
            mode: 'cors'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Cliente actualizado:', data);
        
        Swal.fire({
            icon: 'success',
            title: 'Cliente Actualizado',
            text: 'El nombre y apellido del cliente fueron actualizados exitosamente',
            confirmButtonColor: '#4CAF50'
        });
        
        document.getElementById("editarCliente").reset();
        
    } catch (error) {
        console.error('Error:', error);
        
        Swal.fire({
            icon: 'error',
            title: 'Error al Actualizar',
            text: `Error al actualizar cliente: ${error.message}`,
            confirmButtonColor: '#E74C3C'
        });
    }
});

//eliminar cliente
document.getElementById("eliminarCliente").addEventListener("submit", async (event) => {
    event.preventDefault();

    const dni = document.getElementById("eliminarDni").value;

    try {
        const confirmResult = await Swal.fire({
            title: '¿Está seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmResult.isConfirmed) {
            const response = await fetch(`${API_BASE_URL}/${dni}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            Swal.fire({
                icon: 'success',
                title: 'Cliente Eliminado',
                text: 'El cliente ha sido eliminado exitosamente',
                confirmButtonColor: '#4CAF50'
            });

            document.getElementById("eliminarCliente").reset();
        }
    } catch (error) {
        console.error('Error:', error);
        
        Swal.fire({
            icon: 'error',
            title: 'Error al Eliminar',
            text: `Error al eliminar cliente: ${error.message}`,
            confirmButtonColor: '#E74C3C'
        });
    }
});

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

//buscar cuenta
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

        Swal.fire({
            icon: 'success',
            title: 'Cuenta Encontrada',
            text: `La cuenta ${data.numeroCuenta} fue encontrada exitosamente`,
            confirmButtonColor: '#4CAF50'
        });

    } catch (error) {
        console.error('Error:', error);

        Swal.fire({
            icon: 'error',
            title: 'Error al Buscar Cuenta',
            text: `Error al buscar la cuenta: ${error.message}`,
            confirmButtonColor: '#E74C3C'
        });
    }
});

//buscar cuent ax dni
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

        Swal.fire({
            icon: 'success',
            title: 'Cuentas Encontradas',
            text: `Se encontraron ${data.length} cuentas para el DNI ${dni}`,
            confirmButtonColor: '#4CAF50'
        });

    } catch (error) {
        console.error('Error:', error);

        Swal.fire({
            icon: 'error',
            title: 'Error al Buscar Cuentas',
            text: `Error al buscar cuentas: ${error.message}`,
            confirmButtonColor: '#E74C3C'
        });
    }
});

//buscar movimientos
document.getElementById("buscarTransacciones").addEventListener("submit", async (event) => {
    event.preventDefault();

    const accountNumber = document.getElementById("BuscarTransaccionPorNumero").value;

    try {
        const response = await fetch(`${API_ACCOUNT_URL}/${accountNumber}/transacciones`);

        if (!response.ok) {
            if (response.status === 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cuenta no encontrada',
                    text: 'La cuenta que buscás no existe.',
                    confirmButtonColor: '#E74C3C'
                });
                throw new Error("Cuenta no encontrada.");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la solicitud',
                    text: `Error: ${response.status}`,
                    confirmButtonColor: '#E74C3C'
                });
                throw new Error(`Error: ${response.status}`);
            }
        }

        const data = await response.json();

        if (!data || !data.transacciones || data.transacciones.length === 0) {
            document.getElementById("respuestaTransaccion").textContent =
                "No se encontraron transacciones para esta cuenta.";

            Swal.fire({
                icon: 'info',
                title: 'Sin Transacciones',
                text: 'No se encontraron transacciones para esta cuenta.',
                confirmButtonColor: '#3498DB'
            });

            return;
        }

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
        Swal.fire({
            icon: 'success',
            title: 'Transacciones Encontradas',
            text: `Se encontraron ${data.transacciones.length} transacciones para la cuenta ${data.numeroCuenta}.`,
            confirmButtonColor: '#4CAF50'
        });

    } catch (error) {
        console.error("Error:", error);
        document.getElementById("respuestaTransaccion").textContent =
            `Error al buscar transacciones: ${error.message}`;

        Swal.fire({
            icon: 'error',
            title: 'Error al buscar transacciones',
            text: `${error.message}`,
            confirmButtonColor: '#E74C3C'
        });
    }
});


const API_TRANSACTION_URL = "https://practicasprofesionales-4.onrender.com/api";

//transferencia
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

    const data = await response.json();

    if (!response.ok || data.estado === "FALLIDA") {
        throw new Error(data.mensaje || `Error inesperado: HTTP ${response.status}`);
    }

    Swal.fire({
        icon: "success",
        title: "Transferencia Exitosa",
        text: `${data.estado}: ${data.mensaje}`,
        confirmButtonColor: "#4CAF50",
    });
} catch (error) {
    console.error("Error al realizar transferencia:", error);

    Swal.fire({
        icon: "error",
        title: "Error al realizar transferencia",
        text: `${error.message}`,
        confirmButtonColor: "#E74C3C",
    });
}
});
//deposito
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

        const data = await response.json();

        if (!response.ok || data.estado === "FALLIDA") {
            throw new Error(data.mensaje || `Error inesperado: HTTP ${response.status}`);
        }

        Swal.fire({
            icon: "success",
            title: "Depósito Exitoso",
            text: `${data.estado}: ${data.mensaje}`,
            confirmButtonColor: "#4CAF50",
        });
    } catch (error) {
        console.error("Error al realizar depósito:", error);

        Swal.fire({
            icon: "error",
            title: "Error al realizar depósito",
            text: `${error.message}`,
            confirmButtonColor: "#E74C3C",
        });
    }
});



//retiro
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
        const data = await response.json();
        if (!response.ok || data.estado === "FALLIDA") {
            throw new Error(data.mensaje || `Error inesperado: HTTP ${response.status}`);
        }

        Swal.fire({
            icon: "success",
            title: "Retiro Exitoso",
            text: `${data.estado}: ${data.mensaje}`,
            confirmButtonColor: "#4CAF50",
        });
    } catch (error) {
        console.error("Error al realizar retiro:", error);

        Swal.fire({
            icon: "error",
            title: "Error al realizar retiro",
            text: `${error.message}`,
            confirmButtonColor: "#E74C3C",
        });
    }
});
