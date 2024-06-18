//se importa la función para guardar los datos
import { getData, getDocumento, remove, save, update } from './firestore.js'
//id para guardar el id del documento 
let id = 0
//addEventListener permite activar el elemento según un evento(click)
document.getElementById('btnSave').addEventListener('click', (event) => {
    
    event.preventDefault()
    //validamos que los campos no seas vacios
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id)
    })
    if (document.querySelectorAll('.is-invalid').length == 0) {
        const emp = {
            run: document.getElementById('run').value,
            nom: document.getElementById('nombre').value,
            ape: document.getElementById('apellido').value,
            fecha: document.getElementById('fecha').value,
            email: document.getElementById('email').value,
            fono: document.getElementById('fono').value,
            sueldo: document.getElementById('sueldo').value
        }
        if (id == 0) {
            //función que permite el guardado de datos
            save(emp)
            Swal.fire('Guardado','','success')
        } else{
            //permite editar los datos si el id es diferente de 0
            update(id,emp)
        }
        id = 0
        limpiar()
    }
})
//DOMCOntentLoaded es un evento que se ejecuta cuando se reacarga la página
window.addEventListener('DOMContentLoaded', () => {
    //getData función que trae la colección
    getData((datos) => {
        let tabla = ''
        //recorremos la colección y creamos el objeto emp que trae cada documento
        datos.forEach((emp) => {
            //emp.data() trae los datos de cada documento
            const item = emp.data()
            tabla += `<tr>
                <td>${item.run}</td>
                <td>${item.nom}</td>
                <td>${item.ape}</td>
                <td>${item.fecha}</td>
                <td>${item.email}</td>
                <td>${item.fono}</td>
                <td>${item.sueldo}</td>
                <td nowrap>
                    <button class="btn btn-warning" id="${emp.id}">Editar</button>
                    <button class="btn btn-danger" id="${emp.id}">Eliminar</button>
                </td>
            </tr>`
        })
        document.getElementById('contenido').innerHTML = tabla
        //eliminar
        document.querySelectorAll('.btn-danger').forEach(btn => {
            //verificamos cual es el botón presionado
            btn.addEventListener('click', () => {
                //sweetalert que permite confirmarción
                Swal.fire({
                    title: "¿Estás seguro de eliminar el registro?",
                    text: "No podrás revertir los cambios",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    //presiono el botón eliminar
                    if (result.isConfirmed) {
                        //función eliminar
                        remove(btn.id)
                        Swal.fire({
                            title: "Eliminado!",
                            text: "Su regostro ha sido eliminado",
                            icon: "success"
                        })
                    }
                })
            })
        })
        //seleccionar 
        document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', async () => {
                //invocar función que permite buscar el documento por id
                const doc = await getDocumento(btn.id)
                //asignar los valores del documento
                const emp = doc.data()

                document.getElementById('run').value = emp.run
                document.getElementById('nombre').value = emp.nom
                document.getElementById('apellido').value = emp.ape
                document.getElementById('fecha').value = emp.fecha
                document.getElementById('email').value = emp.email
                document.getElementById('fono').value = emp.fono
                document.getElementById('sueldo').value = emp.sueldo

                //asignamos el id del documento a la variable
                id = doc.id
                //run sólo lectura
                document.getElementById('run').readOnly = true
                //btn cambie el valor a editar
                document.getElementById('btnSave').value = 'Editar'
            })
        })

    })
})