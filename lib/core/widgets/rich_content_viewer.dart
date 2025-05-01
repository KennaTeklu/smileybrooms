import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';

/// A widget that renders rich HTML content with support for various media types
class RichContentViewer extends StatefulWidget {
  final String htmlContent;
  final bool useAdvancedRenderer;
  final Map<String, Style>? customStyles;
  final double? width;
  final bool enableInteraction;

  const RichContentViewer({
    Key? key,
    required this.htmlContent,
    this.useAdvancedRenderer = false,
    this.customStyles,
    this.width,
    this.enableInteraction = true,
  }) : super(key: key);

  @override
  State<RichContentViewer> createState() => _RichContentViewerState();
}

class _RichContentViewerState extends State<RichContentViewer> {
  Map<String, VideoPlayerController> _videoControllers = {};
  Map<String, ChewieController> _chewieControllers = {};

  @override
  void dispose() {
    for (final controller in _videoControllers.values) {
      controller.dispose();
    }
    for (final controller in _chewieControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.useAdvancedRenderer) {
      return HtmlWidget(
        widget.htmlContent,
        customStylesBuilder: (element) {
          if (element.classes.contains('highlight')) {
            return {'color': 'red', 'font-weight': 'bold'};
          }
          return null;
        },
        onTapUrl: widget.enableInteraction ? _handleUrlTap : null,
        onTapImage: widget.enableInteraction
            ? (ImageMetadata image) {
                _showImageDialog(context, image.sources.first.url);
                return true;
              }
            : null,
        factoryBuilder: () => _CustomWidgetFactory(),
      );
    } else {
      return Html(
        data: widget.htmlContent,
        style: widget.customStyles ?? {},
        onLinkTap: widget.enableInteraction
            ? (url, _, __, ___) {
                if (url != null) {
                  _handleUrlTap(url);
                }
              }
            : null,
        onImageTap: widget.enableInteraction
            ? (url, _, __, ___) {
                if (url != null) {
                  _showImageDialog(context, url);
                }
              }
            : null,
        tagsList: Html.tags..addAll(['video', 'iframe']),
        customRenders: {
          tagMatcher('video'): CustomRender.widget(widget: (context, buildChildren) {
            final String? src = context.tree.attributes['src'];
            if (src == null) return const SizedBox();
            
            return _buildVideoPlayer(src);
          }),
          tagMatcher('iframe'): CustomRender.widget(widget: (context, buildChildren) {
            final String? src = context.tree.attributes['src'];
            if (src == null) return const SizedBox();
            
            if (src.contains('youtube.com') || src.contains('youtu.be')) {
              return _buildYoutubeEmbed(src);
            }
            
            return Container(
              height: 200,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
              ),
              child: Center(
                child: TextButton(
                  onPressed: widget.enableInteraction ? () => _handleUrlTap(src) : null,
                  child: const Text('Open External Content'),
                ),
              ),
            );
          }),
        },
      );
    }
  }

  Future<bool> _handleUrlTap(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
      return true;
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not open $url')),
      );
      return false;
    }
  }

  void _showImageDialog(BuildContext context, String url) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Container(
          constraints: BoxConstraints(
            maxWidth: MediaQuery.of(context).size.width * 0.9,
            maxHeight: MediaQuery.of(context).size.height * 0.7,
          ),
          child: Image.network(
            url,
            fit: BoxFit.contain,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              return Center(
                child: CircularProgressIndicator(
                  value: loadingProgress.expectedTotalBytes != null
                      ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                      : null,
                ),
              );
            },
            errorBuilder: (context, error, stackTrace) {
              return const Center(
                child: Icon(Icons.error_outline, color: Colors.red, size: 50),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildVideoPlayer(String src) {
    if (!_videoControllers.containsKey(src)) {
      final videoController = VideoPlayerController.network(src);
      _videoControllers[src] = videoController;
      
      videoController.initialize().then((_) {
        if (mounted) {
          final chewieController = ChewieController(
            videoPlayerController: videoController,
            autoPlay: false,
            looping: false,
            aspectRatio: videoController.value.aspectRatio,
            errorBuilder: (context, errorMessage) {
              return Center(
                child: Text(
                  errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
              );
            },
          );
          
          setState(() {
            _chewieControllers[src] = chewieController;
          });
        }
      });
    }
    
    if (_chewieControllers.containsKey(src)) {
      return AspectRatio(
        aspectRatio: _videoControllers[src]!.value.aspectRatio,
        child: Chewie(controller: _chewieControllers[src]!),
      );
    }
    
    return const SizedBox(
      height: 200,
      child: Center(child: CircularProgressIndicator()),
    );
  }

  Widget _buildYoutubeEmbed(String src) {
    // Extract video ID
    String? videoId;
    if (src.contains('youtube.com')) {
      videoId = Uri.parse(src).queryParameters['v'];
    } else if (src.contains('youtu.be')) {
      videoId = src.split('/').last;
    }
    
    if (videoId == null) {
      return const SizedBox();
    }
    
    // Create a thumbnail with play button
    return GestureDetector(
      onTap: widget.enableInteraction
          ? () => _handleUrlTap(src)
          : null,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Image.network(
            'https://img.youtube.com/vi/$videoId/0.jpg',
            height: 200,
            width: double.infinity,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return Container(
                height: 200,
                color: Colors.black12,
                child: const Center(child: Text('YouTube Video')),
              );
            },
          ),
          Container(
            width: 60,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.red,
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(
              Icons.play_arrow,
              color: Colors.white,
              size: 30,
            ),
          ),
        ],
      ),
    );
  }
}

class _CustomWidgetFactory extends WidgetFactory {
  // Add custom widget handling if needed
}
