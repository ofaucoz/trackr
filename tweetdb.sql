CREATE TABLE IF NOT EXISTS metadata(
  id serial, 
  result_type VARCHAR(1000),
  iso_language_code VARCHAR(1000),
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS entities(
  id serial,
  urls VARCHAR(1000),
  hashtag VARCHAR(1000),
  user_mentions VARCHAR(1000),
  symbols VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS extended_entities(
  id serial,
  media VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS user(
  id serial,
  utc_offset INT,
  friends_count INT,
  profile_image_url_https VARCHAR(1000),
  listed_count INT,
  profile_background_image_url VARCHAR(1000),
  default_profile_image BOOLEAN,
  favourites_count INT,
  description VARCHAR(10000),
  created_at DATETIME,
  is_translator BOOLEAN,
  profile_background_image_url_https VARCHAR(1000),
  protected BOOLEAN,
  screen_name VARCHAR(1000),
  id_str VARCHAR(1000),
  geo_enabled BOOLEAN,
  profile_background_color VARCHAR(1000),
  lang VARCHAR(1000),
  has_extended_profile BOOLEAN,
  profile_sidebar_border_color VARCHAR(1000),
  profile_text_color VARCHAR(1000),
  verified BOOLEAN,
  profile_image_url VARCHAR(1000),
  time_zone VARCHAR(1000),
  url VARCHAR(1000),
  contributors_enabled BOOLEAN,
  profile_background_title VARCHAR(1000),
  profile_banner_url VARCHAR(1000),
  statuses_count INT,
  follow_request_sent BOOLEAN,
  followers_count INT,
  profile_use_background_image BOOLEAN,
  default_profile BOOLEAN,
  following BOOLEAN,  
  name VARCHAR(1000),
  location VARCHAR(1000),
  profile_sidebar_fill_color VARCHAR(1000),
  notifications BOOLEAN,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tweet(
  id serial,
  in_reply_to_status_id_str VARCHAR(1000),
  in_reply_to_status_id VARCHAR(1000),
  created_at DATETIME,
  source VARCHAR(1000),
  retweet_count INT,
  retweeted VARCHAR(1000),
  geo VARCHAR(1000),
  in_reply_to_screen_name VARCHAR(1000),
  is_quote_status VARCHAR(1000),
  favorite_count INT,
  tweet_id INT,
  tweet_text VARCHAR(180),
  place VARCHAR(1000),
  lang VARCHAR(1000),
  favorited BOOLEAN,
  possibly_sensitive BOOLEAN,
  coordinates VARCHAR(1000),
  truncated BOOLEAN,
  contributors VARCHAR(1000),
  user BIGINT UNSIGNED,
  entities BIGINT UNSIGNED,
  FOREIGN KEY(entities) REFERENCES entities(id),
  FOREIGN KEY(user) REFERENCES user(id),
  PRIMARY KEY(id)
);