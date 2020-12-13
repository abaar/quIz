/*
SQLyog Community
MySQL - 5.7.29 : Database - quiz_item_selection
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `base_competency` */

DROP TABLE IF EXISTS `base_competency`;

CREATE TABLE `base_competency` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `core_id` int(11) unsigned DEFAULT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `core_id` (`core_id`),
  CONSTRAINT `base_competency_ibfk_1` FOREIGN KEY (`core_id`) REFERENCES `core_competency` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `core_competency` */

DROP TABLE IF EXISTS `core_competency`;

CREATE TABLE `core_competency` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` int(11) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `class` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  CONSTRAINT `core_competency_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `question_algorithms` */

DROP TABLE IF EXISTS `question_algorithms`;

CREATE TABLE `question_algorithms` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `level` float DEFAULT '0',
  `index` float DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `question_algorithms_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `question_answers` */

DROP TABLE IF EXISTS `question_answers`;

CREATE TABLE `question_answers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` bigint(20) unsigned DEFAULT NULL,
  `label` text,
  `is_correct` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `question_answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `question_specific_competencies` */

DROP TABLE IF EXISTS `question_specific_competencies`;

CREATE TABLE `question_specific_competencies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `question_id` bigint(20) unsigned DEFAULT NULL,
  `specific_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `specific_id` (`specific_id`),
  CONSTRAINT `question_specific_competencies_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `question_specific_competencies_ibfk_2` FOREIGN KEY (`specific_id`) REFERENCES `specific_competency` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `questions` */

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `true_count` int(11) NOT NULL DEFAULT '0',
  `false_count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `specific_competency` */

DROP TABLE IF EXISTS `specific_competency`;

CREATE TABLE `specific_competency` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `base_id` int(10) unsigned DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `base_id` (`base_id`),
  CONSTRAINT `specific_competency_ibfk_1` FOREIGN KEY (`base_id`) REFERENCES `base_competency` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `subjects` */

DROP TABLE IF EXISTS `subjects`;

CREATE TABLE `subjects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `test_logs` */

DROP TABLE IF EXISTS `test_logs`;

CREATE TABLE `test_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `test_id` int(10) unsigned DEFAULT NULL,
  `question` text,
  `question_id` bigint(20) unsigned DEFAULT NULL,
  `specific` text,
  `specific_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` float DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `question_id` (`question_id`),
  KEY `test_id` (`test_id`),
  KEY `user_id` (`user_id`),
  KEY `specific_id` (`specific_id`),
  CONSTRAINT `test_logs_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `test_logs_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `test_logs_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `test_logs_ibfk_4` FOREIGN KEY (`specific_id`) REFERENCES `specific_competency` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `test_specific_competencies` */

DROP TABLE IF EXISTS `test_specific_competencies`;

CREATE TABLE `test_specific_competencies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `test_id` int(10) unsigned DEFAULT NULL,
  `specific_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `test_id` (`test_id`),
  KEY `specific_id` (`specific_id`),
  CONSTRAINT `test_specific_competencies_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `test_specific_competencies_ibfk_2` FOREIGN KEY (`specific_id`) REFERENCES `specific_competency` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `test_taker_answers` */

DROP TABLE IF EXISTS `test_taker_answers`;

CREATE TABLE `test_taker_answers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `test_id` int(10) unsigned DEFAULT NULL,
  `answers_id` bigint(20) unsigned DEFAULT NULL,
  `question_id` bigint(20) unsigned DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT '0',
  `timestamps` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time_needed_in_seconds` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `test_id` (`test_id`),
  KEY `answers_id` (`answers_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `test_taker_answers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `test_taker_answers_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL,
  CONSTRAINT `test_taker_answers_ibfk_3` FOREIGN KEY (`answers_id`) REFERENCES `question_answers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `test_taker_answers_ibfk_4` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `test_takers` */

DROP TABLE IF EXISTS `test_takers`;

CREATE TABLE `test_takers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `test_id` int(10) unsigned DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `start` time DEFAULT NULL,
  `end` time DEFAULT NULL,
  `score` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `test_id` (`test_id`),
  CONSTRAINT `test_takers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `test_takers_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `tests` */

DROP TABLE IF EXISTS `tests`;

CREATE TABLE `tests` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` text,
  `topic_id` int(10) unsigned DEFAULT NULL,
  `subject_id` int(10) unsigned DEFAULT NULL,
  `date` date NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `algorithm_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tests_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `topics` */

DROP TABLE IF EXISTS `topics`;

CREATE TABLE `topics` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` int(11) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `topics_ibfk_1` (`subject_id`),
  CONSTRAINT `topics_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
