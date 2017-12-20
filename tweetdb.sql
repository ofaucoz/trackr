CREATE TABLE IF NOT EXISTS metadata(
  id serial, 
  result_type TEXT,
  iso_language_code TEXT,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS entities(
  id serial,
  urls TEXT,
  hashtag TEXT,
  user_mentions TEXT,
  symbols TEXT
);

CREATE TABLE IF NOT EXISTS extended_entities(
  id serial,
  media TEXT
);

CREATE TABLE IF NOT EXISTS user(
  id serial,
  utc_offset INT,
  friends_count INT,
  profile_image_url_https TEXT,
  listed_count INT,
  profile_background_image_url TEXT,
  default_profile_image BOOLEAN,
  favourites_count INT,
  description TEXT,
  created_at DATETIME,
  is_translator BOOLEAN,
  profile_background_image_url_https TEXT,
  protected BOOLEAN,
  screen_name TEXT,
  id_str TEXT,
  geo_enabled BOOLEAN,
  profile_background_color TEXT,
  lang TEXT,
  has_extended_profile BOOLEAN,
  profile_sidebar_border_color TEXT,
  profile_text_color TEXT,
  verified BOOLEAN,
  profile_image_url TEXT,
  time_zone TEXT,
  url TEXT,
  contributors_enabled BOOLEAN,
  profile_background_title TEXT,
  profile_banner_url TEXT,
  statuses_count INT,
  follow_request_sent BOOLEAN,
  followers_count INT,
  profile_use_background_image BOOLEAN,
  default_profile BOOLEAN,
  following BOOLEAN,  
  name TEXT,
  location TEXT,
  profile_sidebar_fill_color TEXT,
  notifications BOOLEAN,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tweet(
  id serial,
  in_reply_to_status_id_str TEXT,
  in_reply_to_status_id TEXT,
  created_at DATETIME,
  source TEXT,
  retweet_count INT,
  retweeted TEXT,
  geo TEXT,
  in_reply_to_screen_name TEXT,
  is_quote_status TEXT,
  favorite_count INT,
  tweet_id INT,
  tweet_text VARCHAR(180),
  place TEXT,
  lang TEXT,
  favorited BOOLEAN,
  possibly_sensitive BOOLEAN,
  coordinates TEXT,
  truncated BOOLEAN,
  contributors TEXT,
  user BIGINT UNSIGNED,
  entities BIGINT UNSIGNED,
  FOREIGN KEY(entities) REFERENCES entities(id),
  FOREIGN KEY(user) REFERENCES user(id),
  PRIMARY KEY(id)
);