// ===============================
// SISTEMA DE PEDIDOS - ESQUINA DO ZÉ
// ===============================

let pedido = [];
let total = 0;

// Adiciona item (ou aumenta a quantidade)
function addItem(nome, preco) {
  const itemExistente = pedido.find(item => item.nome === nome);
  if (itemExistente) {
    itemExistente.qtd += 1;
    itemExistente.total = itemExistente.qtd * itemExistente.preco;
  } else {
    pedido.push({ nome, preco, qtd: 1, total: preco });
  }
  atualizarPedido();
}

// Atualiza lista de itens e total
function atualizarPedido() {
  const lista = document.getElementById("lista-pedido");
  const totalDiv = document.getElementById("total");
  const limparBtn = document.getElementById("limpar");

  lista.innerHTML = "";
  total = pedido.reduce((sum, item) => sum + item.total, 0);

  pedido.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nome} — R$ ${item.total.toFixed(2)} 
      <div class="quantidade">
        <button class="quant-btn" onclick="alterarQtd(${index}, -1)">➖</button>
        <span>${item.qtd}x</span>
        <button class="quant-btn" onclick="alterarQtd(${index}, 1)">➕</button>
        <button class="remove" onclick="removerItem(${index})">❌</button>
      </div>
    `;
    lista.appendChild(li);
  });

  totalDiv.textContent = pedido.length
    ? `Total: R$ ${total.toFixed(2)}`
    : "Nenhum item adicionado.";

  limparBtn.style.display = pedido.length > 0 ? "inline-block" : "none";
}

// Altera a quantidade de um item
function alterarQtd(index, valor) {
  pedido[index].qtd += valor;
  if (pedido[index].qtd <= 0) {
    pedido.splice(index, 1);
  } else {
    pedido[index].total = pedido[index].qtd * pedido[index].preco;
  }
  atualizarPedido();
}

// Remove um item específico
function removerItem(index) {
  pedido.splice(index, 1);
  atualizarPedido();
}

// Limpa todos os itens do pedido
function limparPedido() {
  if (pedido.length === 0) return;
  if (confirm("Tem certeza que deseja limpar todo o pedido?")) {
    pedido = [];
    total = 0;
    atualizarPedido();
  }
}

// Envia o pedido para o WhatsApp
function enviarPedido() {
  if (pedido.length === 0) {
    alert("Adicione itens ao pedido antes de enviar!");
    return;
  }

  const numeroWhatsApp = "5531971082123"; // Número da Esquina do Zé
  const params = new URLSearchParams(window.location.search);
  const mesa = params.get("mesa") || prompt("Digite o número da mesa:");

  const textoPedido = pedido
    .map(item => `- ${item.nome} (${item.qtd}x R$${item.preco.toFixed(2)}) = R$${item.total.toFixed(2)}`)
    .join("%0A");

  const mensagem = `🍻 *Esquina do Zé*%0A🪑 Mesa: ${mesa}%0A%0A${textoPedido}%0A%0A💰 *Total:* R$${total.toFixed(2)}`;
  const url = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

  window.open(url, "_blank");
}
