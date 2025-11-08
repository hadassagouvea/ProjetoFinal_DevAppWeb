import { subscribeCars, addCar, updateCar, deleteCar } from "./firebase.js";

const form = document.getElementById("car-form");
const carIdInput = document.getElementById("car-id");
const marcaInput = document.getElementById("marca");
const modeloInput = document.getElementById("modelo");
const corInput = document.getElementById("cor");
const placaInput = document.getElementById("placa");
const anoInput = document.getElementById("ano");
const kmInput = document.getElementById("km");
const tbody = document.getElementById("cars-tbody");
const btnCancel = document.getElementById("btn-cancel");

function renderRows(cars){
  tbody.innerHTML = "";
  cars.forEach(car => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(car.marca ?? "")}</td>
      <td>${escapeHtml(car.modelo ?? "")}</td>
      <td>${escapeHtml(car.cor ?? "")}</td>
      <td><span class="badge">${escapeHtml(car.placa ?? "")}</span></td>
      <td>${escapeHtml(car.ano ?? "")}</td>
      <td>${escapeHtml(car.km ?? "")}</td>
      <td>
        <div class="row-actions">
          <button class="btn" data-edit="${car.id}">Editar</button>
          <button class="btn" data-del="${car.id}">Excluir</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

const unsubscribe = subscribeCars(renderRows);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const car = {
    marca: marcaInput.value.trim(),
    modelo: modeloInput.value.trim(),
    cor: corInput.value.trim(),
    placa: placaInput.value.trim().toUpperCase(),
    ano: Number(anoInput.value),
    km: Number(kmInput.value)
  };

  if (!car.marca || !car.modelo || !car.cor || !car.placa || !car.ano || isNaN(car.km)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const idEdicao = carIdInput.value;
    if (idEdicao) {
      await updateCar(idEdicao, car);
    } else {
      await addCar(car);
    }
    resetForm();
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar. Verifique o console.");
  }
});

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const { edit, del } = btn.dataset;

  if (edit) {
    const tr = btn.closest("tr");
    const tds = tr.querySelectorAll("td");
    carIdInput.value = edit;
    marcaInput.value = tds[0].innerText;
    modeloInput.value = tds[1].innerText;
    corInput.value = tds[2].innerText;
    placaInput.value = tds[3].innerText;
    anoInput.value = tds[4].innerText;
    kmInput.value = tds[5].innerText;
    marcaInput.focus();
  }

  if (del) {
    if (confirm("Tem certeza que deseja excluir este automóvel?")) {
      try {
        await deleteCar(del);
      } catch (err) {
        console.error(err);
        alert("Erro ao excluir. Verifique o console.");
      }
    }
  }
});

btnCancel.addEventListener("click", resetForm);

function resetForm(){
  form.reset();
  carIdInput.value = "";
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

window.addEventListener("beforeunload", () => unsubscribe());
