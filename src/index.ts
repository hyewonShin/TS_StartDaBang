interface User {
  id: number;
  name: string;
  role: "customer" | "admin";
}

interface Beverage {
  name: string;
  price: number;
}

interface Order {
  orderId: number;
  customerId: number;
  customerName: string;
  beverageName: string;
  status: "placed" | "completed" | "picked-up";
}

let beverages: Beverage[] = [];
let orders: Order[] = [];

// 어드민인지 체크하는 함수
const isAdmin = (user: User): boolean => {
  return user.role === "admin";
};

// 고객인지 체크하는 함수
const isCustomer = (user: User): boolean => {
  return user.role === "customer";
};

// 음료 등록 기능
function addBeverage(user: User, name: string, price: number): void {
  if (!isAdmin(user)) {
    console.log("권한이 없습니다.");
    return;
  }

  const newBeverage: Beverage = { name, price };
  beverages.push(newBeverage);
}

// 음료 삭제 기능
function removeBeverage(user: User, beverageName: string): void {
  if (!isAdmin(user)) {
    console.log("권한이 없습니다.");
    return;
  }

  beverages = beverages.filter((beverages) => beverages.name !== beverageName);
}

// 음료 조회 함수
function getBeverage(user: User): Beverage[] {
  if (!user) {
    return [];
  }
  return beverages;
}

// 음료 찾기 함수
function findBeverage(beverageName: string): Beverage | undefined {
  return beverages.find((beverage) => beverage.name === beverageName);
}

// 음료 주문 기능
function placeOrder(user: User, beverageName: string): number {
  if (!isCustomer(user)) {
    console.log("고객만 주문 가능합니다");
    return -1;
  }

  const beverage = findBeverage(beverageName);
  if (!beverage) {
    console.log("해당 음료를 찾을 수 없습니다.");
    return -1;
  }

  const newOrder: Order = {
    orderId: orders.length + 1,
    customerId: user.id,
    customerName: user.name,
    beverageName,
    status: "placed",
  };

  orders.push(newOrder);

  return newOrder.orderId;
}

// 음료 준비 완료 기능
function completeOrder(user: User, orderId: number): void {
  if (!isAdmin(user)) {
    console.log("관리자 권한이 필요합니다.");
    return;
  }

  let order = orders.find((order) => order.orderId === orderId);

  if (order) {
    order.status = "completed";
    console.log(
      `[고객 메시지] ${order.customerName}님~ 주문하신 ${order.beverageName} 1잔 나왔습니다~`
    );
  }
}

// 음료 수령하는 기능
function pickUpOrder(user: User, orderId: number): void {
  if (!isCustomer(user)) {
    console.log("권한이 없습니다.");
    return;
  }

  const order = orders.find(
    (order) => order.orderId === orderId && order.customerId === user.id
  );

  if (order && order.status === "completed") {
    order.status = "picked-up";
    console.log(
      `[어드민 메시지] 고객 ID[${order.customerId}]님이 주문 ID[${orderId}]을 수령했습니다.`
    );
  }
}
