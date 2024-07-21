import React, { useState } from 'react';
import './navbar.scss';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const user = true;  // Exemplo de usuário logado

    return (
        <nav>
            <div className="left">
                <a href="/" className="logo">
                    <img src="/logo.png" alt="" />
                    <span>LDHomes</span>
                </a>
                <a href="/">Início</a>
                <a href="/">Sobre</a>
                <a href="/">Contato</a>
                <a href="/">Agentes</a>
            </div>
            <div className="right">
                {user ? (
                    <div className="user">
                        <img
                            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt=""
                        />
                        <span>John Doe</span>
                        <Link to="/profile" className="profile">
                            <div className="notification">3</div>
                            <span>Perfil</span>
                        </Link>
                    </div>
                ) : (
                    <>
                        <a href="/login">Entrar</a>
                        <a href="/register" className="register-nav ">
                            Registrar-se
                        </a>
                    </>
                )}
                <div className="menuIcon">
                    <img
                        src="/menu.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                </div>
                <div className={open ? "menu active" : "menu"}>
                    <a href="/">Início</a>
                    <a href="/">Sobre</a>
                    <a href="/">Contato</a>
                    <a href="/">Agentes</a>
                    <a href="/">Entrar</a>
                    <a href="/">Registrar-se</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
