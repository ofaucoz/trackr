package ressources;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.commonshttp.CommonsHttpOAuthConsumer;
import oauth.signpost.exception.OAuthCommunicationException;
import oauth.signpost.exception.OAuthExpectationFailedException;
import oauth.signpost.exception.OAuthMessageSignerException;

public class TwitterBuilder {

	public TwitterBuilder() throws IOException {
		super();
		Properties prop = new Properties();
		InputStream input = null;
		input = new FileInputStream("config.properties");

		// load a properties file
		prop.load(input);

		// get the property values
		consumerKey = prop.getProperty("consumerKey");
		consumerSecret = prop.getProperty("consumerSecret");
		accessToken = prop.getProperty("accessToken");
		accessTokenSecret = prop.getProperty("accessTokenSecret");
	}

	private String consumerKey;
	private String consumerSecret;
	private String accessToken;
	private String accessTokenSecret;

	public JSONObject request(String url) throws UnsupportedOperationException, IOException,
			OAuthMessageSignerException, OAuthExpectationFailedException, OAuthCommunicationException, JSONException {
		OAuthConsumer oAuthConsumer = new CommonsHttpOAuthConsumer(consumerKey, consumerSecret);
		oAuthConsumer.setTokenWithSecret(accessToken, accessTokenSecret);

		// example url : https://api.twitter.com/1.1/statuses/home_timeline.json
		HttpGet httpGet = new HttpGet(url);

		oAuthConsumer.sign(httpGet);

		HttpClient httpClient = HttpClientBuilder.create().build();
		HttpResponse httpResponse = httpClient.execute(httpGet);

		int statusCode = httpResponse.getStatusLine().getStatusCode();
		BufferedReader reader = new BufferedReader(
				new InputStreamReader(httpResponse.getEntity().getContent(), "UTF-8"));
		StringBuilder builder = new StringBuilder();
		for (String line = null; (line = reader.readLine()) != null;) {
			// System.out.println(line);
			builder.append(line).append("\n");
		}
		JSONObject obj = new JSONObject(builder.toString());
		System.out.println();

		return obj;

	}

	public void recurs_parsingJSON(JSONObject obj, JSONArray arr, String previous_key, PrintWriter writer) throws JSONException {
		if (obj == null && arr == null) {
			writer.println("prev_key : " + previous_key);
		} else {
			if (obj != null) {
				//donable in a better way
				Iterator<String> keys = obj.keys();
				while (keys.hasNext()) {
					String next_key = keys.next();
					try {
						// try to cast it as an array
						JSONArray isArray = obj.getJSONArray(previous_key + "," + next_key);
						this.recurs_parsingJSON(null, isArray, previous_key + "," + next_key, writer);
					} catch (JSONException jsonE) {
						try {
							this.recurs_parsingJSON(obj.getJSONObject(next_key), null, previous_key + "," + next_key, writer);
						}
						catch(JSONException e) {
							this.recurs_parsingJSON(null, null, previous_key + "," + next_key, writer);
						}
					}

				}
			} else if (arr != null) {
				for (int i = 0; i < arr.length(); i++) {
					JSONObject current_obj = arr.getJSONObject(i);
					Iterator<String> keys = current_obj.keys();
					while (keys.hasNext()) {
						String next_key = keys.next();
						try {
							// try to cast it as an array
							JSONArray isArray = current_obj.getJSONArray(previous_key + "," + next_key);
							this.recurs_parsingJSON(null, isArray, previous_key + "," + next_key, writer);
						} catch (JSONException jsonE) {
							try {
								this.recurs_parsingJSON(current_obj.getJSONObject(next_key), null, previous_key + "," + next_key, writer);
							}
							catch(JSONException e) {
								this.recurs_parsingJSON(null, null, previous_key + "," + next_key, writer);
							}
						}

					}
				}
			}

		}

	}

	public static void main(String[] args) {
		try {
			PrintWriter writer = new PrintWriter("get_path.txt", "UTF-8");
			TwitterBuilder twitterBuilder = new TwitterBuilder();
			String url = "https://api.twitter.com/1.1/search/tweets.json?q=tugraz";
			JSONObject result = twitterBuilder.request(url);
			JSONArray statuses = result.getJSONArray("statuses");
			twitterBuilder.recurs_parsingJSON(null, statuses, "statuses", writer);
		} catch (Exception e) {
			System.out.println(e);
		}
	}

}
