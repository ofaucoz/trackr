package ressources;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@javax.persistence.Entity
@Table(name = "user")
public class User {
	
	public User(int utc_offset, int friends_count, String profile_image_url_https, int listed_count,
			String profile_background_image_url, boolean default_profile_image, int favourites_count,
			String description, Date created_at, boolean is_translator, String profile_background_image_url_https,
			boolean is_protected, String screen_name, String id_str, boolean geo_enabled,
			String profile_background_color, String lang, boolean has_extended_profile,
			String profile_sidebar_border_color, String profile_text_color, boolean verified, String profile_image_url,
			String time_zone, String url, boolean contributors_enabled, String profile_backgroung_title,
			String profile_banner_url, Entities user, int statuses_count, boolean follow_request_sent,
			int followers_count, boolean profile_use_background_image, boolean default_profile, boolean following,
			String name, String location, String profile_sidebar_fill_color, boolean notifications) {
		super();
		this.utc_offset = utc_offset;
		this.friends_count = friends_count;
		this.profile_image_url_https = profile_image_url_https;
		this.listed_count = listed_count;
		this.profile_background_image_url = profile_background_image_url;
		this.default_profile_image = default_profile_image;
		this.favourites_count = favourites_count;
		this.description = description;
		this.created_at = created_at;
		this.is_translator = is_translator;
		this.profile_background_image_url_https = profile_background_image_url_https;
		this.is_protected = is_protected;
		this.screen_name = screen_name;
		this.id_str = id_str;
		this.geo_enabled = geo_enabled;
		this.profile_background_color = profile_background_color;
		this.lang = lang;
		this.has_extended_profile = has_extended_profile;
		this.profile_sidebar_border_color = profile_sidebar_border_color;
		this.profile_text_color = profile_text_color;
		this.verified = verified;
		this.profile_image_url = profile_image_url;
		this.time_zone = time_zone;
		this.url = url;
		this.contributors_enabled = contributors_enabled;
		this.profile_backgroung_title = profile_backgroung_title;
		this.profile_banner_url = profile_banner_url;
		this.user = user;
		this.statuses_count = statuses_count;
		this.follow_request_sent = follow_request_sent;
		this.followers_count = followers_count;
		this.profile_use_background_image = profile_use_background_image;
		this.default_profile = default_profile;
		this.following = following;
		this.name = name;
		this.location = location;
		this.profile_sidebar_fill_color = profile_sidebar_fill_color;
		this.notifications = notifications;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", unique = true, nullable = false)
	private int id;
	
	@Column(name = "utc_offset")
	private int utc_offset;

	@Column(name = "friends_count")
	private int friends_count;
	
	@Column(name = "profile_image_url_https")
	private String profile_image_url_https;
	
	@Column(name = "listed_count")
	private int listed_count;
	
	@Column(name = "profile_background_image_url")
	private String profile_background_image_url;
	
	@Column(name = "default_profile_image")
	private boolean default_profile_image;
	
	@Column(name = "favourites_count")
	private int favourites_count;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "created_at", columnDefinition = "DATETIME")
	@Temporal(TemporalType.TIMESTAMP)
	private Date created_at;
	
	@Column(name = "is_translator")
	private boolean is_translator;
	
	@Column(name = "profile_background_image_url_https")
	private String profile_background_image_url_https;
	
	@Column(name = "protected")
	private boolean is_protected;
	
	@Column(name = "screen_name")
	private String screen_name;
	
	@Column(name = "id_str")
	private String id_str;
	
	@Column(name = "geo_enabled")
	private boolean geo_enabled;
	
	@Column(name = "profile_background_color")
	private String profile_background_color;
	
	@Column(name = "lang")
	private String lang;
	
	@Column(name = "has_extended_profile")
	private boolean has_extended_profile;
	
	@Column(name = "profile_sidebar_border_color")
	private String profile_sidebar_border_color;
	
	@Column(name = "profile_text_color")
	private String profile_text_color;
	
	@Column(name = "verified")
	private boolean verified;
	
	@Column(name = "profile_image_url")
	private String profile_image_url;
	
	@Column(name = "time_zone")
	private String time_zone;
	
	@Column(name = "url")
	private String url;
	
	@Column(name = "contributors_enabled")
	private boolean contributors_enabled;
	
	@Column(name = "profile_background_title")
	private String profile_backgroung_title;
	
	@Column(name = "profile_banner_url")
	private String profile_banner_url;
	
	@OneToOne
	@JoinColumn(name = "entities")
	private Entities user;
	
	@Column(name = "statuses_count")
	private int statuses_count;
	
	@Column(name = "follow_request_sent")
	private boolean follow_request_sent;
	
	@Column(name = "followers_count")
	private int followers_count;
	
	@Column(name = "profile_use_background_image")
	private boolean profile_use_background_image;
	
	@Column(name = "default_profile")
	private boolean default_profile;
	
	@Column(name = "following")
	private boolean following;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "location")
	private String location;
	
	@Column(name = "profile_sidebar_fill_color")
	private String profile_sidebar_fill_color;
	
	@Column(name = "notifications")
	private boolean notifications;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUtc_offset() {
		return utc_offset;
	}

	public void setUtc_offset(int utc_offset) {
		this.utc_offset = utc_offset;
	}

	public int getFriends_count() {
		return friends_count;
	}

	public void setFriends_count(int friends_count) {
		this.friends_count = friends_count;
	}

	public String getProfile_image_url_https() {
		return profile_image_url_https;
	}

	public void setProfile_image_url_https(String profile_image_url_https) {
		this.profile_image_url_https = profile_image_url_https;
	}

	public int getListed_count() {
		return listed_count;
	}

	public void setListed_count(int listed_count) {
		this.listed_count = listed_count;
	}

	public String getProfile_background_image_url() {
		return profile_background_image_url;
	}

	public void setProfile_background_image_url(String profile_background_image_url) {
		this.profile_background_image_url = profile_background_image_url;
	}

	public boolean isDefault_profile_image() {
		return default_profile_image;
	}

	public void setDefault_profile_image(boolean default_profile_image) {
		this.default_profile_image = default_profile_image;
	}

	public int getFavourites_count() {
		return favourites_count;
	}

	public void setFavourites_count(int favourites_count) {
		this.favourites_count = favourites_count;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreated_at() {
		return created_at;
	}

	public void setCreated_at(Date created_at) {
		this.created_at = created_at;
	}

	public boolean isIs_translator() {
		return is_translator;
	}

	public void setIs_translator(boolean is_translator) {
		this.is_translator = is_translator;
	}

	public String getProfile_background_image_url_https() {
		return profile_background_image_url_https;
	}

	public void setProfile_background_image_url_https(String profile_background_image_url_https) {
		this.profile_background_image_url_https = profile_background_image_url_https;
	}

	public boolean isIs_protected() {
		return is_protected;
	}

	public void setIs_protected(boolean is_protected) {
		this.is_protected = is_protected;
	}

	public String getScreen_name() {
		return screen_name;
	}

	public void setScreen_name(String screen_name) {
		this.screen_name = screen_name;
	}

	public String getId_str() {
		return id_str;
	}

	public void setId_str(String id_str) {
		this.id_str = id_str;
	}

	public boolean isGeo_enabled() {
		return geo_enabled;
	}

	public void setGeo_enabled(boolean geo_enabled) {
		this.geo_enabled = geo_enabled;
	}

	public String getProfile_background_color() {
		return profile_background_color;
	}

	public void setProfile_background_color(String profile_background_color) {
		this.profile_background_color = profile_background_color;
	}

	public String getLang() {
		return lang;
	}

	public void setLang(String lang) {
		this.lang = lang;
	}

	public boolean isHas_extended_profile() {
		return has_extended_profile;
	}

	public void setHas_extended_profile(boolean has_extended_profile) {
		this.has_extended_profile = has_extended_profile;
	}

	public String getProfile_sidebar_border_color() {
		return profile_sidebar_border_color;
	}

	public void setProfile_sidebar_border_color(String profile_sidebar_border_color) {
		this.profile_sidebar_border_color = profile_sidebar_border_color;
	}

	public String getProfile_text_color() {
		return profile_text_color;
	}

	public void setProfile_text_color(String profile_text_color) {
		this.profile_text_color = profile_text_color;
	}

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

	public String getProfile_image_url() {
		return profile_image_url;
	}

	public void setProfile_image_url(String profile_image_url) {
		this.profile_image_url = profile_image_url;
	}

	public String getTime_zone() {
		return time_zone;
	}

	public void setTime_zone(String time_zone) {
		this.time_zone = time_zone;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public boolean isContributors_enabled() {
		return contributors_enabled;
	}

	public void setContributors_enabled(boolean contributors_enabled) {
		this.contributors_enabled = contributors_enabled;
	}

	public String getProfile_backgroung_title() {
		return profile_backgroung_title;
	}

	public void setProfile_backgroung_title(String profile_backgroung_title) {
		this.profile_backgroung_title = profile_backgroung_title;
	}

	public String getProfile_banner_url() {
		return profile_banner_url;
	}

	public void setProfile_banner_url(String profile_banner_url) {
		this.profile_banner_url = profile_banner_url;
	}

	public Entities getUser() {
		return user;
	}

	public void setUser(Entities user) {
		this.user = user;
	}

	public int getStatuses_count() {
		return statuses_count;
	}

	public void setStatuses_count(int statuses_count) {
		this.statuses_count = statuses_count;
	}

	public boolean isFollow_request_sent() {
		return follow_request_sent;
	}

	public void setFollow_request_sent(boolean follow_request_sent) {
		this.follow_request_sent = follow_request_sent;
	}

	public int getFollowers_count() {
		return followers_count;
	}

	public void setFollowers_count(int followers_count) {
		this.followers_count = followers_count;
	}

	public boolean isProfile_use_background_image() {
		return profile_use_background_image;
	}

	public void setProfile_use_background_image(boolean profile_use_background_image) {
		this.profile_use_background_image = profile_use_background_image;
	}

	public boolean isDefault_profile() {
		return default_profile;
	}

	public void setDefault_profile(boolean default_profile) {
		this.default_profile = default_profile;
	}

	public boolean isFollowing() {
		return following;
	}

	public void setFollowing(boolean following) {
		this.following = following;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getProfile_sidebar_fill_color() {
		return profile_sidebar_fill_color;
	}

	public void setProfile_sidebar_fill_color(String profile_sidebar_fill_color) {
		this.profile_sidebar_fill_color = profile_sidebar_fill_color;
	}

	public boolean isNotifications() {
		return notifications;
	}

	public void setNotifications(boolean notifications) {
		this.notifications = notifications;
	}

}
