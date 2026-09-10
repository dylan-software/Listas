enum OrderStatus {
  Requested = "Solicitado",
  InQuote = "En cotización",
  Approved = "Aprobado",
  InPreparation = "En preparación",
  Shipped = "Enviado",
  Delivered = "Entregado",
  Paid = "Pagado",
  Rejected = "Rechazado",
}

// Equivalente a la clase "Auto" del ejemplo del parqueadero.
class Order {
  constructor(
    public id: string,
    public customer: string,
    public product: string,
    public quantity: number,
    public status: OrderStatus = OrderStatus.Requested
  ) {}
}

// Equivalente a la clase "Parking" del ejemplo visto en clase.
class OrderManagement {
  private maxCapacity: number;
  private orders: Order[] = [];

  constructor(maxCapacity: number) {
    this.maxCapacity = maxCapacity;
  }

  // Igual a searchCar(plate): busca por id y devuelve el índice.
  searchOrder(id: string): number {
    return this.orders.findIndex((o) => o.id === id);
  }

  // Igual a addCar(car): agrega si hay cupo en la lista.
  addOrder(order: Order): void {
    if (this.searchOrder(order.id) !== -1) {
      console.error("Ya existe un pedido con ese ID");
      return;
    }
    if (this.orders.length < this.maxCapacity) {
      this.orders.push(order);
    } else {
      console.error("Capacidad máxima de pedidos alcanzada");
    }
  }

  // Igual a deleteCar(plate): elimina por id con splice.
  deleteOrder(id: string): void {
    const orderIndex = this.searchOrder(id);
    if (orderIndex !== -1) {
      this.orders.splice(orderIndex, 1);
    } else {
      console.error("Pedido no encontrado");
    }
  }

  // Igual a updateCar(plate, carNew): reemplaza el registro completo.
  updateOrder(id: string, orderNew: Order): void {
    const orderIndex = this.searchOrder(id);
    if (orderIndex !== -1) {
      this.orders[orderIndex] = orderNew;
    } else {
      console.error("Pedido no encontrado");
    }
  }

  // Método adicional para mover el pedido a lo largo del
  // flujo del diagrama de procesos (solicitud -> ... -> pago).
  updateOrderStatus(id: string, newStatus: OrderStatus): void {
    const orderIndex = this.searchOrder(id);
    if (orderIndex !== -1 && this.orders[orderIndex]) {
      this.orders[orderIndex].status = newStatus;
    } else {
      console.error("Pedido no encontrado");
    }
  }

  // Igual a getQuantitySpacesAvailable(): cupo restante en la lista.
  getAvailableQuantity(): number {
    return this.maxCapacity - this.orders.length;
  }

  // Igual a listCarsParked(): devuelve la lista completa.
  listOrders(): Order[] {
    return this.orders;
  }
}

// =========================================================
// Interfaz de usuario: conecta la clase OrderManagement (la
// lista) con el HTML. Todo lo de abajo es manejo del DOM.
// =========================================================

const MAX_CAPACITY = 10;
const orderManagement = new OrderManagement(MAX_CAPACITY);

const form = document.getElementById("form-pedido") as HTMLFormElement;
const inputId = document.getElementById("input-id") as HTMLInputElement;
const inputCliente = document.getElementById("input-cliente") as HTMLInputElement;
const inputProducto = document.getElementById("input-producto") as HTMLInputElement;
const inputCantidad = document.getElementById("input-cantidad") as HTMLInputElement;

const inputBuscar = document.getElementById("input-buscar") as HTMLInputElement;
const btnBuscar = document.getElementById("btn-buscar") as HTMLButtonElement;

const tablaBody = document.getElementById("tabla-pedidos-body") as HTMLTableSectionElement;
const capacidadTexto = document.getElementById("capacidad-texto") as HTMLParagraphElement;
const mensaje = document.getElementById("mensaje") as HTMLDivElement;

const orderedStatuses: OrderStatus[] = [
  OrderStatus.Requested,
  OrderStatus.InQuote,
  OrderStatus.Approved,
  OrderStatus.InPreparation,
  OrderStatus.Shipped,
  OrderStatus.Delivered,
  OrderStatus.Paid,
  OrderStatus.Rejected,
];

function showMessage(text: string, type: "ok" | "error"): void {
  mensaje.textContent = text;
  mensaje.className = `mensaje mensaje--${type}`;
  mensaje.classList.remove("oculto");
  window.setTimeout(() => mensaje.classList.add("oculto"), 2600);
}

function createStatusSelect(order: Order): HTMLSelectElement {
  const select = document.createElement("select");
  select.className = "select-estado";
  orderedStatuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    if (status === order.status) option.selected = true;
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    orderManagement.updateOrderStatus(order.id, select.value as OrderStatus);
    renderTable();
    showMessage(`Pedido ${order.id} actualizado a "${select.value}"`, "ok");
  });
  return select;
}

function badgeClass(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Paid:
    case OrderStatus.Delivered:
      return "badge badge--exito";
    case OrderStatus.Rejected:
      return "badge badge--error";
    case OrderStatus.Requested:
    case OrderStatus.InQuote:
      return "badge badge--pendiente";
    default:
      return "badge badge--proceso";
  }
}

function renderTable(): void {
  const orders = orderManagement.listOrders();
  tablaBody.innerHTML = "";

  if (orders.length === 0) {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td colspan="6" class="fila-vacia">Todavía no hay pedidos registrados.</td>`;
    tablaBody.appendChild(fila);
  }

  orders.forEach((order) => {
    const fila = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = order.id;

    const tdCliente = document.createElement("td");
    tdCliente.textContent = order.customer;

    const tdProducto = document.createElement("td");
    tdProducto.textContent = `${order.product} (x${order.quantity})`;

    const tdEstado = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = badgeClass(order.status);
    badge.textContent = order.status;
    tdEstado.appendChild(badge);

    const tdCambiarEstado = document.createElement("td");
    tdCambiarEstado.appendChild(createStatusSelect(order));

    const tdAcciones = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-eliminar";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => {
      orderManagement.deleteOrder(order.id);
      renderTable();
      showMessage(`Pedido ${order.id} eliminado`, "ok");
    });
    tdAcciones.appendChild(btnEliminar);

    fila.append(tdId, tdCliente, tdProducto, tdEstado, tdCambiarEstado, tdAcciones);
    tablaBody.appendChild(fila);
  });

  capacidadTexto.textContent = `Cupos disponibles: ${orderManagement.getAvailableQuantity()} de ${MAX_CAPACITY}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = inputId.value.trim();
  const customer = inputCliente.value.trim();
  const product = inputProducto.value.trim();
  const quantity = Number(inputCantidad.value);

  if (!id || !customer || !product || !quantity || quantity <= 0) {
    showMessage("Completa todos los campos con valores válidos", "error");
    return;
  }

  if (orderManagement.searchOrder(id) !== -1) {
    showMessage(`Ya existe un pedido con el ID "${id}"`, "error");
    return;
  }

  if (orderManagement.getAvailableQuantity() <= 0) {
    showMessage("No hay cupo disponible para más pedidos", "error");
    return;
  }

  const newOrder = new Order(id, customer, product, quantity);
  orderManagement.addOrder(newOrder);
  renderTable();
  showMessage(`Pedido ${id} agregado correctamente`, "ok");
  form.reset();
  inputId.focus();
});

btnBuscar.addEventListener("click", () => {
  const id = inputBuscar.value.trim();
  if (!id) return;

  const index = orderManagement.searchOrder(id);
  const rows = Array.from(tablaBody.querySelectorAll("tr"));
  rows.forEach((row) => row.classList.remove("fila-resaltada"));

  if (index === -1) {
    showMessage(`No se encontró ningún pedido con el ID "${id}"`, "error");
    return;
  }

  const foundRow = rows[index];
  if (foundRow) {
    foundRow.classList.add("fila-resaltada");
    foundRow.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  showMessage(`Pedido ${id} encontrado en la posición ${index} de la lista`, "ok");
});

// Datos de ejemplo para que la tabla no arranque vacía,
// tal como en el ejemplo de la clase Parking con carMazda,
// carFord, carChevrolet, etc.
orderManagement.addOrder(new Order("P-001", "Laura Gómez", "Teclado mecánico", 1, OrderStatus.Requested));
orderManagement.addOrder(new Order("P-002", "Carlos Ruiz", "Monitor 24\"", 2, OrderStatus.InQuote));
orderManagement.addOrder(new Order("P-003", "Ana Torres", "Mouse inalámbrico", 3, OrderStatus.InPreparation));
orderManagement.addOrder(new Order("P-004", "Diego Peña", "Silla ergonómica", 1, OrderStatus.Delivered));

renderTable();