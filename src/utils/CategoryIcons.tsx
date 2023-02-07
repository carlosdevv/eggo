import { BiCar } from "react-icons/bi";
import { FiHeadphones, FiPocket, FiCreditCard } from "react-icons/fi";
import { IoBagHandleOutline, IoWalletOutline } from "react-icons/io5";
import { MdOutlineAttachMoney, MdOutlineLunchDining } from "react-icons/md";

export const optionsCategory = [
  { icon: <BiCar />, title: "Transporte" },
  { icon: <MdOutlineLunchDining />, title: "Comida" },
  { icon: <IoBagHandleOutline />, title: "Compras" },
  { icon: <IoWalletOutline />, title: "Trabalho" },
  { icon: <FiHeadphones />, title: "Lazer" },
  { icon: <MdOutlineAttachMoney />, title: "Investimentos" },
  { icon: <FiCreditCard />, title: "Pagamentos" },
  { icon: <FiPocket />, title: "Outros" },
];
