CREATE TABLE IF NOT EXISTS metadata(
  id serial, 
  result_type VARCHAR(100),
  iso_language_code VARCHAR(100),
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS entities(
  id serial,
  urls VARCHAR(100),
  hashtag VARCHAR(100),
  user_mentions VARCHAR(100),
  symbols VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS extended_entities(
  id serial,
  media VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user(
  id serial,
  utc_offset INT,
  friends_count INT,
  profile_image_url_https VARCHAR(100),
  listed_count INT,
  profile_background_image_url VARCHAR(100),
  default_profile_image BOOLEAN,
  favourites_count INT,
  description VARCHAR(100),
  created_at DATETIME,
  is_translator BOOLEAN,
  profile_background_image_url_https VARCHAR(100),
  protected BOOLEAN,
  screen_name VARCHAR(100),
  id_str VARCHAR(100),
  geo_enabled BOOLEAN,
  profile_background_color VARCHAR(100),
  lang VARCHAR(100),
  has_extended_profile BOOLEAN,
  profile_sidebar_border_color VARCHAR(100),
  profile_text_color VARCHAR(100),
  verified BOOLEAN,
  profile_image_url VARCHAR(100),
  time_zone VARCHAR(100),
  url VARCHAR(100),
  contributors_enabled BOOLEAN,
  profile_background_title VARCHAR(100),
  profile_banner_url VARCHAR(100),
  entities BIGINT UNSIGNED,
  statuses_count INT,
  follow_request_sent BOOLEAN,
  followers_count INT,
  profile_use_background_image BOOLEAN,
  default_profile BOOLEAN,
  following BOOLEAN,  
  name VARCHAR(100),
  location VARCHAR(100),
  profile_sidebar_fill_color VARCHAR(100),
  notifications BOOLEAN,
  FOREIGN KEY(entities) REFERENCES entities(id),
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tweet(
  id serial,
  in_reply_to_status_id_str VARCHAR(100),
  in_reply_to_status_id VARCHAR(100),
  created_at DATETIME,
  source VARCHAR(100),
  retweet_count INT,
  retweeted VARCHAR(100),
  geo VARCHAR(100),
  in_reply_to_screen_name VARCHAR(100),
  is_quote_status VARCHAR(100),
  favorite_count INT,
  tweet_id INT,
  tweet_text VARCHAR(180),
  place VARCHAR(100),
  lang VARCHAR(100),
  favorited BOOLEAN,
  possibly_sensitive BOOLEAN,
  coordinates VARCHAR(100),
  truncated BOOLEAN,
  contributors VARCHAR(100),
  user BIGINT UNSIGNED,
  FOREIGN KEY(user) REFERENCES user(id),
  PRIMARY KEY(id)
);