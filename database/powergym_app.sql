-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-01-2026 a las 18:37:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `powergym_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clases`
--

CREATE TABLE `clases` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `class_date` date NOT NULL,
  `class_time` time NOT NULL,
  `trainer` varchar(100) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `available_capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clases`
--

INSERT INTO `clases` (`id`, `name`, `description`, `class_date`, `class_time`, `trainer`, `max_capacity`, `available_capacity`) VALUES
(14, 'Yoga', 'Clase de yoga mensual', '2026-01-03', '09:00:00', 'Marta Fit', 15, 15),
(15, 'Spinning', 'Clase de spinning intensa', '2026-01-05', '18:00:00', 'Luis Bike', 12, 12),
(16, 'Cross Training', 'Entrenamiento funcional', '2026-01-10', '19:00:00', 'Pedro Strong', 10, 10),
(18, 'Yoga', 'Clase de yoga mensual', '2026-02-03', '09:00:00', 'Marta Fit', 15, 15),
(19, 'Boxeo', 'Boxeo nivel intermedio', '2026-02-07', '19:00:00', 'Roberto Box', 8, 8),
(20, 'BodyPump', 'Entrenamiento con pesas', '2026-02-12', '18:00:00', 'Laura Power', 15, 15),
(21, 'Zumba', 'Zumba divertida y dinámica', '2026-02-20', '17:00:00', 'Sofía Dance', 20, 20),
(22, 'Pilates', 'Pilates para todos los niveles', '2026-01-06', '17:00:00', 'Ana Core', 14, 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `reservation_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` varchar(255) DEFAULT 'default.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `profile_image`) VALUES
(2, 'David Monzón', 'david@gmail.com', '600123123', '$2b$10$dadXDkVJMtc.UIcrYNHg9uCLmgg0HTA36j/KThxSy4jB64z7TN9KW', 'user', '2025-12-25 18:47:17', '/uploads/profile-images/user_2.jpg'),
(3, 'Admin', 'admin@gym.com', '123456789', '$2b$10$3E/YfijyRgY5DIhp3TUljeohiDXQ.YmDSsByMFRibCDmfTbaTMtBG', 'admin', '2025-12-25 18:54:47', 'default.png'),
(9, 'Ana López', 'ana@gym.com', '600111222', '$2b$10$fwCPPuGt4ieOM.5GDS/Qx.WBOXgisCMotuOXRMlqO35M2fBogCOna', 'user', '2026-01-22 20:20:37', 'default.png'),
(10, 'Carlos Ruiz', 'carlos@gym.com', '600333444', '$2b$10$oX4qR/vMv9fdyLgW21LlROGYUY45pSgzjCggo0PNCniar3FD/qnsi', 'user', '2026-01-22 20:21:04', 'default.png'),
(11, 'Laura Gómez', 'laura@gym.com', '600555666', '$2b$10$b3XUGdTBwkQn/LlHzPLJxOc8ULBTRWKZe1IvMYxRj9kfaqdOmMT3K', 'user', '2026-01-22 20:21:26', 'default.png');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clases`
--
ALTER TABLE `clases`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`class_id`),
  ADD KEY `reservas_ibfk_2` (`class_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clases`
--
ALTER TABLE `clases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `clases` (`id`) ON DELETE CASCADE;

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`localhost` EVENT `borrar_clases_pasadas` ON SCHEDULE EVERY 1 DAY STARTS '2026-01-22 21:16:34' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM clases
WHERE class_date < DATE_FORMAT(CURDATE(), '%Y-%m-01')$$

CREATE DEFINER=`root`@`localhost` EVENT `borrar_reservas_semana_anterior` ON SCHEDULE EVERY 1 WEEK STARTS '2026-01-26 00:00:00' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM reservas
WHERE YEARWEEK(reservation_date, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;