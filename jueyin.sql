CREATE DATABASE `jueyin` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
-- jueyin.users definition

CREATE TABLE `users` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `info` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_email_IDX` (`email`,`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;


-- jueyin.articles definition

CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `content` mediumtext,
  `introduction` varchar(100) DEFAULT NULL,
  `views` int(11) DEFAULT '0',
  `likes` int(11) DEFAULT '0',
  `favorites` int(11) DEFAULT '0',
  `creator_id` int(11) DEFAULT NULL,
  `creator_name` varchar(100) DEFAULT NULL,
  `category_id` int(4) DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT '0',
  `status` int(4) DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `articles_creator_id_IDX` (`creator_id`,`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;


-- jueyin.categorys definition

CREATE TABLE `categorys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `like_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `type` int(4) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `value` int(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `like_records_target_id_IDX` (`target_id`,`user_id`,`type`) USING BTREE,
  KEY `like_records_user_id_IDX` (`user_id`,`target_id`,`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- jueyin.schedule_records definition
CREATE TABLE `schedule_records` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`target_id` int(11) DEFAULT NULL,
`excution_time` timestamp DEFAULT NULL,
`status` int(4) DEFAULT '0',
`created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
`updated_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
`type` int(11) NOT NULL,
PRIMARY KEY (`id`),
KEY `schedule_records_excution_time_IDX` (`excution_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;